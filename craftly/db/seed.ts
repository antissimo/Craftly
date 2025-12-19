// lib/db/seed.ts
import { db } from './index';
import { users, cvs, experience, education, skills } from './schema';
import { v4 as uuidv4 } from 'uuid';


async function seedDatabase() {
  console.log('🌱 Starting database seed...');
  console.log(db)
  console.log(process.env.A)
  try {

    // Mock korisnici
    const mockUsers = [
      { id: uuidv4(), email: 'john.doe@example.com' },
      { id: uuidv4(), email: 'jane.smith@example.com' },
      { id: uuidv4(), email: 'alice.johnson@example.com' },
      { id: uuidv4(), email: 'bob.williams@example.com' },
      { id: uuidv4(), email: 'charlie.brown@example.com' },
      { id: uuidv4(), email: 'diana.prince@example.com' },
      { id: uuidv4(), email: 'edward.miller@example.com' },
      { id: uuidv4(), email: 'fiona.garcia@example.com' },
      { id: uuidv4(), email: 'george.martin@example.com' },
      { id: uuidv4(), email: 'helen.davis@example.com' },
    ];

    console.log('Inserting users...');
    await db.insert(users).values(mockUsers);

    // Mock CV-ovi
    const mockCVs = [
      {
        id: uuidv4(),
        userId: mockUsers[0].id,
        title: 'Senior Software Engineer CV',
        summary: 'Experienced full-stack developer with 8+ years in web technologies.',
      },
      {
        id: uuidv4(),
        userId: mockUsers[1].id,
        title: 'UX/UI Designer Portfolio',
        summary: 'Creative designer focused on user-centered design.',
      },
      {
        id: uuidv4(),
        userId: mockUsers[2].id,
        title: 'Data Scientist Resume',
        summary: 'Data professional with expertise in machine learning.',
      },
      {
        id: uuidv4(),
        userId: mockUsers[3].id,
        title: 'DevOps Engineer CV',
        summary: 'Infrastructure specialist with CI/CD, Kubernetes.',
      },
      {
        id: uuidv4(),
        userId: mockUsers[4].id,
        title: 'Project Manager Resume',
        summary: 'Agile PM with 10+ years managing software teams.',
      },
      {
        id: uuidv4(),
        userId: mockUsers[5].id,
        title: 'Frontend Developer CV',
        summary: 'JavaScript expert specializing in React, Vue.',
      },
      {
        id: uuidv4(),
        userId: mockUsers[6].id,
        title: 'Backend Developer Resume',
        summary: 'Backend specialist in Node.js, Python, microservices.',
      },
      {
        id: uuidv4(),
        userId: mockUsers[7].id,
        title: 'Mobile Developer CV',
        summary: 'iOS and Android developer with published apps.',
      },
      {
        id: uuidv4(),
        userId: mockUsers[8].id,
        title: 'QA Engineer Resume',
        summary: 'Quality assurance expert with automation testing.',
      },
      {
        id: uuidv4(),
        userId: mockUsers[9].id,
        title: 'Cybersecurity Specialist CV',
        summary: 'Security professional with penetration testing.',
      },
    ];

    console.log('Inserting CVs...');
    await db.insert(cvs).values(mockCVs);

    // Mock iskustva
    const mockExperiences = [
      // Za CV 1
      {
        id: uuidv4(),
        cvId: mockCVs[0].id,
        company: 'Tech Giant Inc.',
        position: 'Senior Software Engineer',
        startDate: new Date('2020-03-01'),
        endDate: null,
        description: 'Led a team of 5 developers.',
      },
      {
        id: uuidv4(),
        cvId: mockCVs[0].id,
        company: 'Startup Labs',
        position: 'Full Stack Developer',
        startDate: new Date('2018-06-01'),
        endDate: new Date('2020-02-28'),
        description: 'Developed web applications.',
      },
      // Za CV 2
      {
        id: uuidv4(),
        cvId: mockCVs[1].id,
        company: 'Design Studio Pro',
        position: 'Lead UX Designer',
        startDate: new Date('2019-04-01'),
        endDate: null,
        description: 'Designed user interfaces.',
      },
      {
        id: uuidv4(),
        cvId: mockCVs[1].id,
        company: 'Creative Agency',
        position: 'UI Designer',
        startDate: new Date('2017-08-01'),
        endDate: new Date('2019-03-31'),
        description: 'Created visual designs.',
      },
      // Za CV 3
      {
        id: uuidv4(),
        cvId: mockCVs[2].id,
        company: 'Data Insights Co.',
        position: 'Data Scientist',
        startDate: new Date('2021-01-15'),
        endDate: null,
        description: 'Built ML models.',
      },
      // Za CV 4
      {
        id: uuidv4(),
        cvId: mockCVs[3].id,
        company: 'Cloud Systems',
        position: 'DevOps Engineer',
        startDate: new Date('2020-05-01'),
        endDate: null,
        description: 'Managed Kubernetes.',
      },
      // Za CV 5
      {
        id: uuidv4(),
        cvId: mockCVs[4].id,
        company: 'Project Masters',
        position: 'Senior Project Manager',
        startDate: new Date('2018-09-01'),
        endDate: null,
        description: 'Managed projects.',
      },
      // Za CV 6
      {
        id: uuidv4(),
        cvId: mockCVs[5].id,
        company: 'Frontend Experts',
        position: 'Senior Frontend Developer',
        startDate: new Date('2020-02-01'),
        endDate: null,
        description: 'Built React apps.',
      },
      // Za CV 7
      {
        id: uuidv4(),
        cvId: mockCVs[6].id,
        company: 'Backend Solutions',
        position: 'Backend Developer',
        startDate: new Date('2019-07-01'),
        endDate: null,
        description: 'Developed APIs.',
      },
      // Za CV 8
      {
        id: uuidv4(),
        cvId: mockCVs[7].id,
        company: 'Mobile First',
        position: 'Senior Mobile Developer',
        startDate: new Date('2020-10-01'),
        endDate: null,
        description: 'Developed mobile apps.',
      },
      // Za CV 9
      {
        id: uuidv4(),
        cvId: mockCVs[8].id,
        company: 'Quality Assurance Inc',
        position: 'QA Lead',
        startDate: new Date('2019-03-01'),
        endDate: null,
        description: 'Led testing efforts.',
      },
      // Za CV 10
      {
        id: uuidv4(),
        cvId: mockCVs[9].id,
        company: 'Security Pros',
        position: 'Cybersecurity Analyst',
        startDate: new Date('2020-06-01'),
        endDate: null,
        description: 'Conducted security audits.',
      },
    ];

    console.log('Inserting experiences...');
    await db.insert(experience).values(mockExperiences);

    // Mock obrazovanje
    const mockEducation = [
      { id: uuidv4(), cvId: mockCVs[0].id, school: 'Stanford University', degree: 'Master of Computer Science', startDate: new Date('2014-09-01'), endDate: new Date('2016-05-31') },
      { id: uuidv4(), cvId: mockCVs[1].id, school: 'Rhode Island School of Design', degree: 'Bachelor of Fine Arts', startDate: new Date('2012-09-01'), endDate: new Date('2016-05-31') },
      { id: uuidv4(), cvId: mockCVs[2].id, school: 'Carnegie Mellon', degree: 'PhD in Data Science', startDate: new Date('2014-09-01'), endDate: new Date('2019-05-31') },
      { id: uuidv4(), cvId: mockCVs[3].id, school: 'Georgia Tech', degree: 'Master in Computer Science', startDate: new Date('2015-09-01'), endDate: new Date('2017-05-31') },
      { id: uuidv4(), cvId: mockCVs[4].id, school: 'Harvard Business School', degree: 'MBA', startDate: new Date('2010-09-01'), endDate: new Date('2012-05-31') },
      { id: uuidv4(), cvId: mockCVs[5].id, school: 'University of Washington', degree: 'Bachelor of Computer Science', startDate: new Date('2014-09-01'), endDate: new Date('2018-05-31') },
      { id: uuidv4(), cvId: mockCVs[6].id, school: 'University of Texas', degree: 'Bachelor of Computer Engineering', startDate: new Date('2013-09-01'), endDate: new Date('2017-05-31') },
      { id: uuidv4(), cvId: mockCVs[7].id, school: 'California Institute of Technology', degree: 'Bachelor of Computer Science', startDate: new Date('2014-09-01'), endDate: new Date('2018-05-31') },
      { id: uuidv4(), cvId: mockCVs[8].id, school: 'University of Illinois', degree: 'Bachelor of Information Technology', startDate: new Date('2013-09-01'), endDate: new Date('2017-05-31') },
      { id: uuidv4(), cvId: mockCVs[9].id, school: 'Cybersecurity University', degree: 'Master of Cybersecurity', startDate: new Date('2015-09-01'), endDate: new Date('2017-05-31') },
    ];

    console.log('Inserting education...');
    await db.insert(education).values(mockEducation);

    // Mock vještine
    const mockSkills = [
      // CV 1
      { id: uuidv4(), cvId: mockCVs[0].id, name: 'JavaScript', level: 'Expert' },
      { id: uuidv4(), cvId: mockCVs[0].id, name: 'React', level: 'Expert' },
      { id: uuidv4(), cvId: mockCVs[0].id, name: 'Node.js', level: 'Advanced' },
      // CV 2
      { id: uuidv4(), cvId: mockCVs[1].id, name: 'Figma', level: 'Expert' },
      { id: uuidv4(), cvId: mockCVs[1].id, name: 'Adobe XD', level: 'Advanced' },
      // CV 3
      { id: uuidv4(), cvId: mockCVs[2].id, name: 'Python', level: 'Expert' },
      { id: uuidv4(), cvId: mockCVs[2].id, name: 'Machine Learning', level: 'Advanced' },
      // CV 4
      { id: uuidv4(), cvId: mockCVs[3].id, name: 'Docker', level: 'Expert' },
      { id: uuidv4(), cvId: mockCVs[3].id, name: 'Kubernetes', level: 'Advanced' },
      // CV 5
      { id: uuidv4(), cvId: mockCVs[4].id, name: 'Agile/Scrum', level: 'Expert' },
      { id: uuidv4(), cvId: mockCVs[4].id, name: 'Jira', level: 'Advanced' },
      // CV 6
      { id: uuidv4(), cvId: mockCVs[5].id, name: 'React', level: 'Expert' },
      { id: uuidv4(), cvId: mockCVs[5].id, name: 'TypeScript', level: 'Advanced' },
      // CV 7
      { id: uuidv4(), cvId: mockCVs[6].id, name: 'Node.js', level: 'Expert' },
      { id: uuidv4(), cvId: mockCVs[6].id, name: 'PostgreSQL', level: 'Advanced' },
      // CV 8
      { id: uuidv4(), cvId: mockCVs[7].id, name: 'React Native', level: 'Expert' },
      { id: uuidv4(), cvId: mockCVs[7].id, name: 'Swift', level: 'Advanced' },
      // CV 9
      { id: uuidv4(), cvId: mockCVs[8].id, name: 'Selenium', level: 'Expert' },
      { id: uuidv4(), cvId: mockCVs[8].id, name: 'Jest', level: 'Advanced' },
      // CV 10
      { id: uuidv4(), cvId: mockCVs[9].id, name: 'Penetration Testing', level: 'Expert' },
      { id: uuidv4(), cvId: mockCVs[9].id, name: 'Network Security', level: 'Advanced' },
    ];

    console.log('Inserting skills...');
    await db.insert(skills).values(mockSkills);

    console.log('✅ Database seeded successfully!');
    
    // Prikaži statistiku
    const userCount = await db.select().from(users);
    const cvCount = await db.select().from(cvs);
    const expCount = await db.select().from(experience);
    const eduCount = await db.select().from(education);
    const skillCount = await db.select().from(skills);
    
    console.log('\n📊 Seed Statistics:');
    console.log(`Users: ${userCount.length}`);
    console.log(`CVs: ${cvCount.length}`);
    console.log(`Experiences: ${expCount.length}`);
    console.log(`Education: ${eduCount.length}`);
    console.log(`Skills: ${skillCount.length}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Pokreni seed
seedDatabase();