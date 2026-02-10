export const dummyJobs = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "Tech Solutions Ltd",
      location: "London, UK",
      salary: "£45,000 - £60,000",
      type: "Full-time",
      description: "We are looking for a skilled frontend developer with experience in React and modern JavaScript frameworks.",
      requirements: "3+ years React experience, TypeScript, REST APIs",
      postedDate: "2025-11-01",
      deadline: "2025-11-30",
      applicants: 12
    },
    {
      id: 2,
      title: "Backend Engineer",
      company: "StartupHub",
      location: "Remote",
      salary: "£50,000 - £70,000",
      type: "Full-time",
      description: "Join our growing team to build scalable backend systems using Node.js and PostgreSQL.",
      requirements: "Node.js, PostgreSQL, AWS, 4+ years experience",
      postedDate: "2025-11-03",
      deadline: "2025-12-05",
      applicants: 8
    },
    {
      id: 3,
      title: "UI/UX Designer",
      company: "Creative Agency",
      location: "Manchester, UK",
      salary: "£40,000 - £55,000",
      type: "Contract",
      description: "Looking for a creative UI/UX designer to work on web and mobile applications.",
      requirements: "Figma, Adobe XD, portfolio required",
      postedDate: "2025-11-05",
      deadline: "2025-11-25",
      applicants: 15
    },
    {
      id: 4,
      title: "Data Analyst",
      company: "Finance Corp",
      location: "Birmingham, UK",
      salary: "£35,000 - £48,000",
      type: "Full-time",
      description: "Analyze financial data and create reports using SQL and Python.",
      requirements: "SQL, Python, Excel, 2+ years experience",
      postedDate: "2025-11-06",
      deadline: "2025-12-10",
      applicants: 6
    }
  ];
  
  export const dummyApplications = [
    {
      id: 1,
      jobId: 1,
      jobTitle: "Frontend Developer",
      company: "Tech Solutions Ltd",
      appliedDate: "2025-11-02",
      status: "Under Review",
      matchScore: 78
    },
    {
      id: 2,
      jobId: 2,
      jobTitle: "Backend Engineer",
      company: "StartupHub",
      appliedDate: "2025-11-04",
      status: "Interview",
      matchScore: 85
    },
    {
      id: 3,
      jobId: 3,
      jobTitle: "UI/UX Designer",
      company: "Creative Agency",
      appliedDate: "2025-11-06",
      status: "Applied",
      matchScore: 65
    }
  ];
  
  export const dummyUsers = {
    applicant: {
      email: "applicant@test.com",
      password: "password",
      name: "John Smith",
      role: "APPLICANT"
    },
    company: {
      email: "company@test.com",
      password: "password",
      name: "Tech Solutions Ltd",
      role: "COMPANY"
    },
    admin: {
      email: "admin@test.com",
      password: "password",
      name: "Admin User",
      role: "ADMIN"
    }
  };