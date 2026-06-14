import { DataSource } from 'typeorm';
import { PostEntity } from './post.entity';
import { User } from '../user/user.entity';
import { Company } from '../company/company.entity';
import { UserRole } from '../../common/enums/user-role.enum';
import * as bcrypt from 'bcrypt';

export async function seedPostsAndJobs(dataSource: DataSource) {
  const postRepo = dataSource.getRepository(PostEntity);
  const userRepo = dataSource.getRepository(User);
  const companyRepo = dataSource.getRepository(Company);

  const hasSeeded = await postRepo.findOne({ where: { title: 'Frontend Developer (Vue 3 / Tailwind)' } });
  if (hasSeeded) {
    console.log('Posts and jobs already seeded.');
    return;
  }

  console.log('Seeding mock users, posts and jobs...');

  // 1. Get or create mock users
  let employers = await userRepo.find({ where: { role: UserRole.EMPLOYER } });
  let students = await userRepo.find({ where: { role: UserRole.STUDENT } });

  const hashedPassword = await bcrypt.hash('password123', 10);

  if (employers.length === 0) {
    console.log('Creating mock employer users...');
    const companies = await companyRepo.find();
    
    const employerData = [
      {
        phone: '012345678',
        email: 'employer1@firststep.com',
        password: hashedPassword,
        role: UserRole.EMPLOYER,
        profileCompleted: true,
        companyName: 'Smart Axiata',
        companyDescription: 'Smart Axiata Co., Ltd. is Cambodia\'s leading mobile telecommunications operator.',
        industry: 'technology',
        address: 'phnom_penh',
        website: 'https://www.smart.com.kh',
        logoUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&h=150&fit=crop&q=80',
        isVerified: true,
      },
      {
        phone: '087654321',
        email: 'employer2@firststep.com',
        password: hashedPassword,
        role: UserRole.EMPLOYER,
        profileCompleted: true,
        companyName: 'ABA Bank',
        companyDescription: 'ABA Bank is Cambodia\'s leading private financial institution.',
        industry: 'finance',
        address: 'phnom_penh',
        website: 'https://www.ababank.com',
        logoUrl: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=150&h=150&fit=crop&q=80',
        isVerified: true,
      },
      {
        phone: '099999999',
        email: 'employer3@firststep.com',
        password: hashedPassword,
        role: UserRole.EMPLOYER,
        profileCompleted: true,
        companyName: 'Brown Coffee',
        companyDescription: 'Brown Coffee & Bakery is a homegrown Cambodian cafe brand.',
        industry: 'fnb',
        address: 'phnom_penh',
        website: 'https://www.browncoffee.com.kh',
        logoUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=150&h=150&fit=crop&q=80',
        isVerified: true,
      }
    ];

    for (const data of employerData) {
      const company = companies.find(c => c.name.toLowerCase() === data.companyName.toLowerCase());
      const emp = userRepo.create({
        ...data,
        company: company || null,
        companyId: company ? company.id : null,
      } as any);
      await userRepo.save(emp);
    }

    employers = await userRepo.find({ where: { role: UserRole.EMPLOYER } });
  }

  if (students.length === 0) {
    console.log('Creating mock student users...');
    const studentData = [
      {
        phone: '011111111',
        email: 'student1@paragon.edu',
        password: hashedPassword,
        role: UserRole.STUDENT,
        profileCompleted: true,
        fullName: 'Chan Mengkong',
        university: 'Paragon International University',
        major: 'Computer Science',
        yearOfStudy: 3,
        skills: ['Vue.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'PostgreSQL'],
        isStudentVerified: true,
      },
      {
        phone: '022222222',
        email: 'student2@rupp.edu',
        password: hashedPassword,
        role: UserRole.STUDENT,
        profileCompleted: true,
        fullName: 'Sok Mean',
        university: 'Royal University of Phnom Penh',
        major: 'Information Technology',
        yearOfStudy: 4,
        skills: ['React.js', 'JavaScript', 'Express', 'MongoDB'],
        isStudentVerified: true,
      }
    ];

    for (const data of studentData) {
      const std = userRepo.create(data);
      await userRepo.save(std);
    }

    students = await userRepo.find({ where: { role: UserRole.STUDENT } });
  }

  // 2. Seed Jobs
  const jobsData = [
    {
      title: 'Frontend Developer (Vue 3 / Tailwind)',
      content: 'We are looking for a passionate Frontend Developer to join our team. You will build highly interactive web applications using Vue 3, Pinia, and Tailwind CSS.\n\n**Requirements:**\n- Familiarity with Vue 3 and TypeScript\n- Responsive CSS design\n- Good team communication',
      isJob: true,
      salary: '$600 - $900',
      location: 'Phnom Penh',
      jobType: 'Full-time',
      skills: ['Vue.js', 'TypeScript', 'Tailwind CSS'],
      requirements: ['Vue 3 knowledge', 'Responsive layout design'],
      status: 'approved' as const,
    },
    {
      title: 'ACCA Audit Associate',
      content: 'Join ABA Bank\'s auditing division as an Audit Associate. You will assist in financial auditing, compliance reviews, and financial analysis.\n\n**Requirements:**\n- Completed or pursuing ACCA level 2/3\n- Analytical mindset\n- High attention to detail',
      isJob: true,
      salary: '$500 - $800',
      location: 'Phnom Penh',
      jobType: 'Full-time',
      skills: ['Accounting', 'Audit', 'ACCA'],
      requirements: ['ACCA pursuit', 'Excel proficiency'],
      status: 'approved' as const,
    },
    {
      title: 'UI/UX Design Intern',
      content: 'Brown Coffee is seeking a creative UI/UX Design Intern to help improve our customer-facing digital applications. You will create user flows, wireframes, and prototypes.\n\n**Requirements:**\n- Proficiency in Figma\n- Design portfolio\n- Basic understanding of user experience principles',
      isJob: true,
      salary: '$200 - $350',
      location: 'Phnom Penh',
      jobType: 'Internship',
      skills: ['Figma', 'UI/UX Design', 'Wireframing'],
      requirements: ['Figma experience', 'Portfolio submission'],
      status: 'approved' as const,
    },
    {
      title: 'QA Automation Engineer',
      content: 'Sabay Digital is hiring a QA Automation Engineer to build automated testing pipelines for our gaming and news platforms.\n\n**Requirements:**\n- Experience with Playwright or Cypress\n- Basic JavaScript/TypeScript coding skills\n- CI/CD integration knowledge',
      isJob: true,
      salary: '$700 - $1100',
      location: 'Phnom Penh',
      jobType: 'Full-time',
      skills: ['Playwright', 'QA Automation', 'TypeScript'],
      requirements: ['Playwright knowledge', 'Testing automation experience'],
      status: 'approved' as const,
    },
    {
      title: 'Mobile App Engineer (Flutter)',
      content: 'Cellcard is looking for a Mobile App Engineer experienced in Flutter to build the next generation of our telecommunications app.\n\n**Requirements:**\n- Deep knowledge of Dart and Flutter framework\n- State management (Bloc or Provider)\n- API integration',
      isJob: true,
      salary: '$800 - $1400',
      location: 'Phnom Penh',
      jobType: 'Full-time',
      skills: ['Flutter', 'Dart', 'Mobile Development'],
      requirements: ['Flutter experience', 'State management knowledge'],
      status: 'approved' as const,
    }
  ];

  // Pick an employer randomly to post
  for (let i = 0; i < jobsData.length; i++) {
    const employer = employers[i % employers.length];
    const job = postRepo.create({
      ...jobsData[i],
      author: employer,
    });
    await postRepo.save(job);
  }

  // 3. Seed Feed Posts
  const feedsData = [
    {
      title: 'Mid-term project finished!',
      content: 'Excited to share that I just finished my mid-term project at Paragon International University! Moving on to learning advanced Vue 3 concepts next week. 🚀 #StudentLife #Coding',
      isJob: false,
      status: 'approved' as const,
      skills: [],
      requirements: [],
    },
    {
      title: 'NestJS Developer Meetup',
      content: 'We are hosting a developer meetup at Brown Coffee (Boeung Keng Kang) this Friday at 6 PM. Come join us to discuss all things NestJS and PostgreSQL! ☕️💻 #Meetup #NestJS',
      isJob: false,
      status: 'approved' as const,
      skills: [],
      requirements: [],
    },
    {
      title: 'Completed my internship!',
      content: 'Just completed my internship at ABA Bank! Grateful for the amazing mentorship and learning experience. Here is to the next chapter! 🎓 #Internship #Finance',
      isJob: false,
      status: 'approved' as const,
      skills: [],
      requirements: [],
    },
    {
      title: 'Game Dev Hackathon',
      content: 'Sabay Digital is hosting an online game development hackathon next month! Open to all university students in Cambodia. Registration opens tomorrow. 🎮 #GameDev #Hackathon',
      isJob: false,
      status: 'approved' as const,
      skills: [],
      requirements: [],
    },
    {
      title: 'CSS Tip of the day',
      content: 'Tip of the day: When writing CSS, try to utilize variables for central themes. It makes glassmorphism styling and dark-mode toggles incredibly clean! 🎨 #WebDev #CSS',
      isJob: false,
      status: 'approved' as const,
      skills: [],
      requirements: [],
    }
  ];

  // Pick a student randomly to post
  for (let i = 0; i < feedsData.length; i++) {
    const student = students[i % students.length];
    const feed = postRepo.create({
      ...feedsData[i],
      author: student,
    });
    await postRepo.save(feed);
  }

  console.log('Seeding completed successfully!');
}
