package com.jobconnect.util;

import com.jobconnect.entity.*;
import com.jobconnect.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final JobSeekerRepository jobSeekerRepository;
    private final RecruiterRepository recruiterRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            RoleRepository roleRepository,
            UserRepository userRepository,
            JobSeekerRepository jobSeekerRepository,
            RecruiterRepository recruiterRepository,
            JobRepository jobRepository,
            ApplicationRepository applicationRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.jobSeekerRepository = jobSeekerRepository;
        this.recruiterRepository = recruiterRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        logger.info("Verifying database seed data...");

        // 1. Initialize Roles
        Role adminRole = getOrCreateRole(RoleName.ROLE_ADMIN);
        Role recruiterRole = getOrCreateRole(RoleName.ROLE_RECRUITER);
        Role seekerRole = getOrCreateRole(RoleName.ROLE_JOB_SEEKER);

        // 2. Initialize Admin User
        if (!userRepository.existsByEmail("admin@jobconnect.com")) {
            User admin = new User(
                    "admin@jobconnect.com",
                    passwordEncoder.encode("admin123"),
                    "System",
                    "Administrator",
                    "+1 555-0100",
                    adminRole
            );
            userRepository.save(admin);
            logger.info("Created Default Admin: admin@jobconnect.com / admin123");
        }

        // 3. Initialize Demo Recruiters
        Recruiter techCorpRecruiter = null;
        if (!userRepository.existsByEmail("recruiter@techcorp.com")) {
            User rUser = new User(
                    "recruiter@techcorp.com",
                    passwordEncoder.encode("recruiter123"),
                    "Sarah",
                    "Jenkins",
                    "+1 555-0144",
                    recruiterRole
            );
            userRepository.save(rUser);

            techCorpRecruiter = new Recruiter(rUser, "TechCorp Global");
            techCorpRecruiter.setCompanyWebsite("https://techcorp-example.com");
            techCorpRecruiter.setCompanyDescription("Leading global enterprise building high-throughput cloud platforms and AI solutions.");
            techCorpRecruiter.setCompanyLogo("https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=150&auto=format&fit=crop&q=80");
            techCorpRecruiter.setIndustry("Information Technology & Services");
            techCorpRecruiter.setLocation("San Francisco, CA / Remote");
            techCorpRecruiter.setDesignation("Head of Global Talent");
            techCorpRecruiter = recruiterRepository.save(techCorpRecruiter);
            logger.info("Created Demo Recruiter: recruiter@techcorp.com / recruiter123");
        } else {
            techCorpRecruiter = recruiterRepository.findByUserEmail("recruiter@techcorp.com").orElse(null);
        }

        Recruiter cloudNexusRecruiter = null;
        if (!userRepository.existsByEmail("talent@cloudnexus.io")) {
            User rUser2 = new User(
                    "talent@cloudnexus.io",
                    passwordEncoder.encode("recruiter123"),
                    "Marcus",
                    "Vance",
                    "+1 555-0199",
                    recruiterRole
            );
            userRepository.save(rUser2);

            cloudNexusRecruiter = new Recruiter(rUser2, "CloudNexus Labs");
            cloudNexusRecruiter.setCompanyWebsite("https://cloudnexus-example.io");
            cloudNexusRecruiter.setCompanyDescription("Next-generation cloud infrastructure orchestration and distributed data systems.");
            cloudNexusRecruiter.setCompanyLogo("https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&auto=format&fit=crop&q=80");
            cloudNexusRecruiter.setIndustry("Cloud & Cybersecurity");
            cloudNexusRecruiter.setLocation("Austin, TX / London, UK");
            cloudNexusRecruiter.setDesignation("Talent Acquisition Director");
            cloudNexusRecruiter = recruiterRepository.save(cloudNexusRecruiter);
        } else {
            cloudNexusRecruiter = recruiterRepository.findByUserEmail("talent@cloudnexus.io").orElse(null);
        }

        // 4. Initialize Demo Job Seekers
        JobSeeker seekerAlex = null;
        if (!userRepository.existsByEmail("seeker@gmail.com")) {
            User sUser = new User(
                    "seeker@gmail.com",
                    passwordEncoder.encode("seeker123"),
                    "Alex",
                    "Morgan",
                    "+1 555-0182",
                    seekerRole
            );
            userRepository.save(sUser);

            seekerAlex = new JobSeeker(sUser);
            seekerAlex.setHeadline("Senior Full Stack Java & React Engineer | Cloud Architect");
            seekerAlex.setBio("Passionate software engineer with 5+ years crafting enterprise microservices with Spring Boot, Java 21, React, Docker, and Kubernetes.");
            seekerAlex.setExperienceYears(5);
            seekerAlex.setEducation("B.S. in Computer Science, State University");
            seekerAlex.setCurrentCompany("Apex Tech Labs");
            seekerAlex.setSkills("Java, Spring Boot, React, TypeScript, MySQL, Docker, Kubernetes, AWS, REST APIs, Microservices");
            seekerAlex.setPortfolioUrl("https://alexmorgan-dev.example.com");
            seekerAlex.setGithubUrl("https://github.com/alexmorgan-dev");
            seekerAlex.setLinkedinUrl("https://linkedin.com/in/alexmorgan-dev");
            seekerAlex.setLocation("Seattle, WA / Remote");
            seekerAlex.setResumeUrl("/api/files/resume/alex_morgan_resume.pdf");
            seekerAlex.setResumeOriginalFilename("Alex_Morgan_Resume_2026.pdf");
            seekerAlex = jobSeekerRepository.save(seekerAlex);
            logger.info("Created Demo Seeker: seeker@gmail.com / seeker123");
        } else {
            seekerAlex = jobSeekerRepository.findByUserEmail("seeker@gmail.com").orElse(null);
        }

        JobSeeker seekerPriya = null;
        if (!userRepository.existsByEmail("priya.sharma@example.com")) {
            User sUser2 = new User(
                    "priya.sharma@example.com",
                    passwordEncoder.encode("seeker123"),
                    "Priya",
                    "Sharma",
                    "+91 98765-43210",
                    seekerRole
            );
            userRepository.save(sUser2);

            seekerPriya = new JobSeeker(sUser2);
            seekerPriya.setHeadline("Lead Frontend Architect & UI/UX Designer");
            seekerPriya.setBio("Creative and analytical frontend specialist focusing on design systems, high-performance web applications, React, Next.js, and Tailwind CSS.");
            seekerPriya.setExperienceYears(4);
            seekerPriya.setEducation("B.Tech in Information Technology");
            seekerPriya.setCurrentCompany("Nova Interactive");
            seekerPriya.setSkills("React, Next.js, JavaScript, Tailwind CSS, Figma, Redux Toolkit, Webpack, Responsive Design, Accessibility (WCAG)");
            seekerPriya.setPortfolioUrl("https://priyasharma.design");
            seekerPriya.setGithubUrl("https://github.com/priyasharma-ui");
            seekerPriya.setLinkedinUrl("https://linkedin.com/in/priyasharma-ui");
            seekerPriya.setLocation("Bengaluru, India / Remote");
            seekerPriya.setResumeUrl("/api/files/resume/priya_sharma_resume.pdf");
            seekerPriya.setResumeOriginalFilename("Priya_Sharma_Frontend_Architect.pdf");
            seekerPriya = jobSeekerRepository.save(seekerPriya);
        } else {
            seekerPriya = jobSeekerRepository.findByUserEmail("priya.sharma@example.com").orElse(null);
        }

        // 5. Initialize Diverse Job Postings
        if (jobRepository.count() == 0 && techCorpRecruiter != null && cloudNexusRecruiter != null) {
            Job job1 = new Job();
            job1.setRecruiter(techCorpRecruiter);
            job1.setTitle("Senior Java Full Stack Developer");
            job1.setDescription("TechCorp is seeking an exceptional Senior Java Full Stack Developer to lead development on our core enterprise cloud platform. You will design, build, and deploy high-performance microservices and modern responsive interfaces.");
            job1.setRequirements("• 4+ years of hands-on experience in Java (17/21) and Spring Boot\n• Strong frontend proficiency with React.js, TypeScript, and modern state management\n• Solid relational database design skills with MySQL or PostgreSQL\n• Experience with RESTful APIs, JWT authentication, and Spring Security\n• Familiarity with Docker, CI/CD pipelines, and cloud deployments");
            job1.setResponsibilities("• Architect and implement robust backend microservices with Spring Boot\n• Develop modern, accessible, responsive React interfaces\n• Collaborate with product managers and UX designers to refine features\n• Write clean, testable, and well-documented code with unit and integration tests\n• Conduct code reviews and mentor junior engineers");
            job1.setJobType(JobType.FULL_TIME);
            job1.setLocation("Remote (USA / Global)");
            job1.setExperienceLevel("Senior Level (4-7 years)");
            job1.setSalaryMin(new BigDecimal("120000"));
            job1.setSalaryMax(new BigDecimal("155000"));
            job1.setSalaryNegotiable(true);
            job1.setSkillsRequired("Java, Spring Boot, React, MySQL, Docker, REST APIs, Microservices");
            job1.setStatus(JobStatus.ACTIVE);
            job1.setVacancies(3);
            job1.setApplicationDeadline(LocalDate.now().plusMonths(2));
            job1 = jobRepository.save(job1);

            Job job2 = new Job();
            job2.setRecruiter(techCorpRecruiter);
            job2.setTitle("Lead Frontend React Architect");
            job2.setDescription("Lead the frontend architectural vision for TechCorp's flagship SaaS portal. You will establish design system standards, optimize web vitals, and mentor a talented team of engineers.");
            job2.setRequirements("• 5+ years of extensive experience building complex React web applications\n• Mastery of JavaScript, CSS3/Tailwind, and modern build tools (Vite, Webpack)\n• Deep knowledge of state management, performance profiling, and browser rendering\n• Strong design sensibilities and experience collaborating in Figma");
            job2.setResponsibilities("• Drive architectural decisions and coding standards for our React client\n• Implement accessible, modular design components and layouts\n• Audit performance and ensure sub-second interaction latencies\n• Guide agile sprint deliveries and code reviews");
            job2.setJobType(JobType.FULL_TIME);
            job2.setLocation("San Francisco, CA / Hybrid");
            job2.setExperienceLevel("Lead / Staff (5+ years)");
            job2.setSalaryMin(new BigDecimal("140000"));
            job2.setSalaryMax(new BigDecimal("175000"));
            job2.setSalaryNegotiable(false);
            job2.setSkillsRequired("React, TypeScript, Tailwind CSS, Vite, Redux, Figma, UI/UX");
            job2.setStatus(JobStatus.ACTIVE);
            job2.setVacancies(1);
            job2.setApplicationDeadline(LocalDate.now().plusMonths(1));
            jobRepository.save(job2);

            Job job3 = new Job();
            job3.setRecruiter(cloudNexusRecruiter);
            job3.setTitle("Senior Cloud DevOps & Kubernetes Engineer");
            job3.setDescription("CloudNexus is looking for a seasoned Cloud & DevOps Engineer to scale our multi-region Kubernetes clusters, optimize CI/CD pipelines, and guarantee 99.99% system reliability.");
            job3.setRequirements("• 4+ years managing cloud infrastructure on AWS, GCP, or Azure\n• Production experience with Kubernetes (EKS/GKE), Terraform, and Helm\n• Deep understanding of CI/CD automation with GitHub Actions\n• Experience with Prometheus, Grafana, and distributed tracing");
            job3.setResponsibilities("• Manage Infrastructure as Code (Terraform) across multi-cloud environments\n• Orchestrate zero-downtime blue-green deployments\n• Implement observability, alerting, and automated incident recovery\n• Partner with development teams to optimize containerized service lifecycles");
            job3.setJobType(JobType.REMOTE);
            job3.setLocation("Remote (Worldwide)");
            job3.setExperienceLevel("Senior Level (4+ years)");
            job3.setSalaryMin(new BigDecimal("130000"));
            job3.setSalaryMax(new BigDecimal("160000"));
            job3.setSalaryNegotiable(true);
            job3.setSkillsRequired("Kubernetes, Docker, AWS, Terraform, CI/CD, Prometheus, Linux");
            job3.setStatus(JobStatus.ACTIVE);
            job3.setVacancies(2);
            job3.setApplicationDeadline(LocalDate.now().plusDays(45));
            jobRepository.save(job3);

            Job job4 = new Job();
            job4.setRecruiter(cloudNexusRecruiter);
            job4.setTitle("Backend Engineer - Distributed Systems (Java / Spring)");
            job4.setDescription("Design fault-tolerant data ingestion pipelines and distributed services handling millions of events daily.");
            job4.setRequirements("• 3+ years in backend engineering with Java, Spring Boot, or Go\n• Strong grasp of concurrent programming and event-driven architectures (Kafka / RabbitMQ)\n• SQL query tuning and distributed cache design (Redis)");
            job4.setResponsibilities("• Implement high-throughput event consumers and streaming services\n• Profile database queries and optimize caching layers\n• Write comprehensive integration and load tests");
            job4.setJobType(JobType.FULL_TIME);
            job4.setLocation("Austin, TX / Remote");
            job4.setExperienceLevel("Mid Level (2-4 years)");
            job4.setSalaryMin(new BigDecimal("105000"));
            job4.setSalaryMax(new BigDecimal("135000"));
            job4.setSalaryNegotiable(true);
            job4.setSkillsRequired("Java, Spring Boot, Kafka, Redis, PostgreSQL, Microservices");
            job4.setStatus(JobStatus.ACTIVE);
            job4.setVacancies(2);
            job4.setApplicationDeadline(LocalDate.now().plusMonths(3));
            jobRepository.save(job4);

            Job job5 = new Job();
            job5.setRecruiter(techCorpRecruiter);
            job5.setTitle("Junior Software Engineer - Full Stack");
            job5.setDescription("Kickstart your software engineering career with TechCorp. Work alongside senior mentors building modern web features and RESTful endpoints.");
            job5.setRequirements("• Degree in Computer Science, Software Engineering, or equivalent bootcamp\n• Foundational knowledge of Java, Object-Oriented Design, and SQL\n• Experience building frontend projects in React or modern JavaScript\n• Eagerness to learn, collaborate, and grow");
            job5.setResponsibilities("• Implement features in our web dashboard and REST APIs\n• Write unit tests and participate in sprint planning\n• Debug and resolve bug tickets under guidance of lead engineers");
            job5.setJobType(JobType.FULL_TIME);
            job5.setLocation("New York, NY / Hybrid");
            job5.setExperienceLevel("Entry Level (0-2 years)");
            job5.setSalaryMin(new BigDecimal("75000"));
            job5.setSalaryMax(new BigDecimal("95000"));
            job5.setSalaryNegotiable(false);
            job5.setSkillsRequired("Java, JavaScript, React, SQL, Git, HTML5, CSS3");
            job5.setStatus(JobStatus.ACTIVE);
            job5.setVacancies(4);
            job5.setApplicationDeadline(LocalDate.now().plusMonths(1));
            jobRepository.save(job5);

            logger.info("Created 5 Sample Job Postings.");

            // 6. Initialize Sample Applications
            if (seekerAlex != null && job1 != null) {
                Application app1 = new Application(
                        job1,
                        seekerAlex,
                        "I have over 5 years of experience building scalable enterprise full stack systems with Java 21, Spring Boot 3, and React. I am excited to contribute to TechCorp's platform.",
                        seekerAlex.getResumeUrl()
                );
                app1.setStatus(ApplicationStatus.SHORTLISTED);
                app1.setNotes("Candidate has strong full-stack background and solid Spring Boot experience. Technical interview scheduled for next Tuesday.");
                applicationRepository.save(app1);
                logger.info("Created Sample Application for Alex Morgan -> Job 1 (SHORTLISTED)");
            }

            if (seekerPriya != null && job1 != null) {
                Application app2 = new Application(
                        job1,
                        seekerPriya,
                        "I am a frontend specialist eager to apply my React and UI architecture skills to high-impact enterprise workflows.",
                        seekerPriya.getResumeUrl()
                );
                app2.setStatus(ApplicationStatus.UNDER_REVIEW);
                app2.setNotes("Profile looks great for frontend aspects. Currently assessing full-stack fit.");
                applicationRepository.save(app2);
            }
        }

        logger.info("Database seed initialization completed successfully.");
    }

    private Role getOrCreateRole(RoleName roleName) {
        return roleRepository.findByName(roleName)
                .orElseGet(() -> roleRepository.save(new Role(roleName)));
    }
}

