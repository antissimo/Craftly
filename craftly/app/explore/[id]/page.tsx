// app/portfolio/[id]/page.tsx (bez stats sekcije)
import { config } from '@/config';
import { format } from 'date-fns';
import Link from 'next/link';
import { notFound } from 'next/navigation';

async function getPortfolio(id: string) {
  try {
    const apiUrl = config.apiUrl || 'http://localhost:3000';
    console.log('Fetching from:', `${apiUrl}/api/explore/${id}`);
    
    const res = await fetch(`${apiUrl}/api/explore/${id}`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    return data.portfolio;
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return null;
  }
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const portfolio = await getPortfolio(id);

  if (!portfolio) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back button */}
      <div className="container mx-auto px-4 py-6">
        <Link
          href="/explore"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Explore
        </Link>
      </div>

      {/* Portfolio Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-800">
                {portfolio.user.email.charAt(0).toUpperCase()}
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {portfolio.user.email.split('@')[0]}
                </h2>
                <p className="text-gray-600">{portfolio.user.email}</p>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {portfolio.title}
            </h1>
            
            <p className="text-lg text-gray-600 mb-6">
              {portfolio.summary || ''}
            </p>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Updated {format(new Date(portfolio.updatedAt), 'MMMM d, yyyy')}
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                Created {format(new Date(portfolio.createdAt), 'MMMM d, yyyy')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Left Column - Experience & Education */}
            <div className="md:col-span-2 space-y-8">
              {/* Experience Section */}
              {portfolio.experiences && portfolio.experiences.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Experience
                  </h2>
                  
                  <div className="space-y-6">
                    {portfolio.experiences.map((exp: any) => (
                      <div key={exp.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                            <p className="text-blue-600 font-medium">{exp.company}</p>
                          </div>
                          <div className="text-sm text-gray-500 text-right">
                            <div>{format(new Date(exp.startDate), 'MMM yyyy')}</div>
                            <div>{exp.endDate ? format(new Date(exp.endDate), 'MMM yyyy') : 'Present'}</div>
                          </div>
                        </div>
                        {exp.description && (
                          <p className="text-gray-600 mt-3">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Education Section */}
              {portfolio.education && portfolio.education.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" opacity="0.5" />
                    </svg>
                    Education
                  </h2>
                  
                  <div className="space-y-6">
                    {portfolio.education.map((edu: any) => (
                      <div key={edu.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{edu.school}</h3>
                            <p className="text-gray-600">{edu.degree || ''}</p>
                          </div>
                          <div className="text-sm text-gray-500 text-right">
                            {edu.startDate && (
                              <div>{format(new Date(edu.startDate), 'yyyy')} - {edu.endDate ? format(new Date(edu.endDate), 'yyyy') : 'Present'}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right Column - Skills ONLY (bez stats) */}
            {portfolio.skills && portfolio.skills.length > 0 && (
              <div className="md:col-span-1">
                <section className="sticky top-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Skills
                  </h2>
                  
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                    <div className="flex flex-wrap gap-2">
                      {portfolio.skills.map((skill: any) => (
                        <span
                          key={skill.id}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                            skill.level === 'Expert'
                              ? 'bg-blue-100 text-blue-800'
                              : skill.level === 'Advanced'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {skill.name}
                          <span className="ml-1 text-xs opacity-75">({skill.level || ''})</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}