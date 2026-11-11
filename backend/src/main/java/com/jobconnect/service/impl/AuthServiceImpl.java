package com.jobconnect.service.impl;

import com.jobconnect.dto.AuthRequest;
import com.jobconnect.dto.AuthResponse;
import com.jobconnect.dto.RegisterRequest;
import com.jobconnect.entity.*;
import com.jobconnect.exception.BadRequestException;
import com.jobconnect.exception.DuplicateResourceException;
import com.jobconnect.exception.ResourceNotFoundException;
import com.jobconnect.repository.JobSeekerRepository;
import com.jobconnect.repository.RecruiterRepository;
import com.jobconnect.repository.RoleRepository;
import com.jobconnect.repository.UserRepository;
import com.jobconnect.security.CustomUserDetails;
import com.jobconnect.security.JwtUtils;
import com.jobconnect.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final JobSeekerRepository jobSeekerRepository;
    private final RecruiterRepository recruiterRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthServiceImpl(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            RoleRepository roleRepository,
            JobSeekerRepository jobSeekerRepository,
            RecruiterRepository recruiterRepository,
            PasswordEncoder passwordEncoder,
            JwtUtils jwtUtils
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.jobSeekerRepository = jobSeekerRepository;
        this.recruiterRepository = recruiterRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @Override
    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userDetails.getUsername()));

        if (!user.isActive()) {
            throw new BadRequestException("Your account has been deactivated. Please contact the administrator.");
        }

        AuthResponse response = new AuthResponse(
                jwt,
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole().getName().name()
        );

        if (user.getRole().getName() == RoleName.ROLE_JOB_SEEKER) {
            jobSeekerRepository.findByUserId(user.getId())
                    .ifPresent(seeker -> response.setJobSeekerId(seeker.getId()));
        } else if (user.getRole().getName() == RoleName.ROLE_RECRUITER) {
            recruiterRepository.findByUserId(user.getId())
                    .ifPresent(recruiter -> response.setRecruiterId(recruiter.getId()));
        }

        return response;
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("User already exists with email: " + request.getEmail());
        }

        RoleName roleName;
        String requestedRole = request.getRole().toUpperCase().trim();
        if ("RECRUITER".equals(requestedRole) || "ROLE_RECRUITER".equals(requestedRole)) {
            roleName = RoleName.ROLE_RECRUITER;
        } else if ("JOB_SEEKER".equals(requestedRole) || "ROLE_JOB_SEEKER".equals(requestedRole)) {
            roleName = RoleName.ROLE_JOB_SEEKER;
        } else {
            throw new BadRequestException("Invalid role specified. Must be JOB_SEEKER or RECRUITER");
        }

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new ResourceNotFoundException("Role", "name", roleName));

        User user = new User(
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getFirstName(),
                request.getLastName(),
                request.getPhone(),
                role
        );

        User savedUser = userRepository.save(user);

        Long seekerId = null;
        Long recruiterId = null;

        if (roleName == RoleName.ROLE_JOB_SEEKER) {
            JobSeeker seeker = new JobSeeker(savedUser);
            JobSeeker savedSeeker = jobSeekerRepository.save(seeker);
            seekerId = savedSeeker.getId();
        } else if (roleName == RoleName.ROLE_RECRUITER) {
            String company = (request.getCompanyName() != null && !request.getCompanyName().isBlank())
                    ? request.getCompanyName()
                    : request.getFirstName() + "'s Company";
            Recruiter recruiter = new Recruiter(savedUser, company);
            Recruiter savedRecruiter = recruiterRepository.save(recruiter);
            recruiterId = savedRecruiter.getId();
        }

        String jwt = jwtUtils.generateTokenFromUsername(savedUser.getEmail());

        AuthResponse response = new AuthResponse(
                jwt,
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getFirstName(),
                savedUser.getLastName(),
                roleName.name()
        );
        response.setJobSeekerId(seekerId);
        response.setRecruiterId(recruiterId);

        return response;
    }
}

