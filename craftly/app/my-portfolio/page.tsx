"use client";

import { useState, useEffect } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import { useAuth } from "../context/AuthContext";

// Types matching your database schema
interface Experience {
  id?: string;
  cv_id: string;
  company: string;
  position: string;
  start_date: string | Date;
  end_date?: string | Date | null;
  description?: string;
}

interface Education {
  id?: string;
  cv_id: string;
  school: string;
  degree?: string;
  start_date?: string | Date | null;
  end_date?: string | Date | null;
}

interface Skill {
  id?: string;
  cv_id: string;
  name: string;
  level?: string;
}

export default function EditablePortfolioPage() {
  const { user, isLoggedIn } = useAuth();
  
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Load user's portfolio when they are logged in
  useEffect(() => {
    const loadUserPortfolio = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        // Get user's CV
        const { data: cvData, error: cvError } = await supabaseClient
          .from("cvs")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();
        
        if (cvError) {
          console.error("Error loading CV:", cvError);
          setLoading(false);
          return;
        }
        
        if (!cvData) {
          setId("");
          setTitle("");
          setSummary("");
          setExperiences([]);
          setEducation([]);
          setSkills([]);
          setLoading(false);
          return;
        }
        
        setId(cvData.id);
        setTitle(cvData.title || "");
        setSummary(cvData.summary || "");
        
        // Get experiences for this CV
        const { data: experiencesData } = await supabaseClient
          .from("experience")
          .select("*")
          .eq("cv_id", cvData.id)
          .order("start_date", { ascending: false });
        
        // Get education for this CV
        const { data: educationData } = await supabaseClient
          .from("education")
          .select("*")
          .eq("cv_id", cvData.id)
          .order("start_date", { ascending: false });
        
        // Get skills for this CV
        const { data: skillsData } = await supabaseClient
          .from("skills")
          .select("*")
          .eq("cv_id", cvData.id);
        
        setExperiences(experiencesData || []);
        setEducation(educationData || []);
        setSkills(skillsData || []);
        
      } catch (err: any) {
        console.error("Error loading portfolio:", err);
        setError("Failed to load portfolio");
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      loadUserPortfolio();
    } else {
      setLoading(false);
    }
  }, [user]);

  const formatDateInput = (value: string | Date | null | undefined) => {
    if (!value) return "";
    const d = typeof value === "string" ? new Date(value) : value;
    return d.toISOString().split("T")[0];
  };

  const handleSave = async () => {
    if (!user) {
      setError("You must be logged in to save a portfolio");
      return;
    }
    
    // Validation
    if (!title.trim()) {
      setError("Portfolio title is required");
      return;
    }
    
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      let portfolioId = id;

      // Check if user already has a CV
      const { data: existingCV, error: cvError } = await supabaseClient
        .from("cvs")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (cvError) throw cvError;

      // Create or update CV
      if (!existingCV) {
        // Create new CV
        const { data, error } = await supabaseClient
          .from("cvs")
          .insert({
            title: title.trim(),
            summary: summary.trim(),
            user_id: user.id,
          })
          .select()
          .single();
        
        if (error) throw error;
        portfolioId = data.id;
        setId(portfolioId);
      } else {
        // Update existing CV
        portfolioId = existingCV.id;
        setId(portfolioId);
        
        const { error } = await supabaseClient
          .from("cvs")
          .update({
            title: title.trim(),
            summary: summary.trim(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", portfolioId);
        
        if (error) throw error;
      }

      // Get existing IDs BEFORE any operations
      const { data: existingExperiences } = await supabaseClient
        .from("experience")
        .select("id")
        .eq("cv_id", portfolioId);
      
      const { data: existingEducation } = await supabaseClient
        .from("education")
        .select("id")
        .eq("cv_id", portfolioId);
      
      const { data: existingSkills } = await supabaseClient
        .from("skills")
        .select("id")
        .eq("cv_id", portfolioId);

      // Handle EXPERIENCES
      const validExperiences = experiences.filter(exp => 
        exp.position?.trim() && exp.company?.trim()
      );
      
      // Get IDs of valid experiences
      const currentExperienceIds = validExperiences
        .map(exp => exp.id)
        .filter(Boolean) as string[];
      
      // Delete orphaned experiences
      const orphanedExpIds = (existingExperiences || [])
        .map(exp => exp.id)
        .filter(id => !currentExperienceIds.includes(id));
      
      if (orphanedExpIds.length > 0) {
        const { error: deleteError } = await supabaseClient
          .from("experience")
          .delete()
          .in('id', orphanedExpIds);
        if (deleteError) throw deleteError;
      }

      // Upsert valid experiences
      if (validExperiences.length > 0) {
        const experienceData = validExperiences.map(exp => {
          const baseData = {
            cv_id: portfolioId,
            company: exp.company.trim(),
            position: exp.position.trim(),
            start_date: exp.start_date ? new Date(exp.start_date).toISOString() : new Date().toISOString(),
            end_date: exp.end_date ? new Date(exp.end_date).toISOString() : null,
            description: exp.description?.trim() || null,
          };
          
          // Only include id if it exists (for updates)
          if (exp.id) {
            return { ...baseData, id: exp.id };
          }
          return baseData; // New record, let DB generate ID
        });

        const { error: upsertError } = await supabaseClient
          .from("experience")
          .upsert(experienceData, { 
            onConflict: 'id',
            ignoreDuplicates: false 
          });
        
        if (upsertError) throw upsertError;
      } else if (existingExperiences && existingExperiences.length > 0) {
        // If no valid experiences but there are existing ones, delete all
        const { error: deleteError } = await supabaseClient
          .from("experience")
          .delete()
          .eq('cv_id', portfolioId);
        if (deleteError) throw deleteError;
      }

      // Handle EDUCATION
      const validEducation = education.filter(edu => edu.school?.trim());
      
      // Get IDs of valid education
      const currentEducationIds = validEducation
        .map(edu => edu.id)
        .filter(Boolean) as string[];
      
      // Delete orphaned education
      const orphanedEduIds = (existingEducation || [])
        .map(edu => edu.id)
        .filter(id => !currentEducationIds.includes(id));
      
      if (orphanedEduIds.length > 0) {
        const { error: deleteError } = await supabaseClient
          .from("education")
          .delete()
          .in('id', orphanedEduIds);
        if (deleteError) throw deleteError;
      }

      // Upsert valid education
      if (validEducation.length > 0) {
        const educationData = validEducation.map(edu => {
          const baseData = {
            cv_id: portfolioId,
            school: edu.school.trim(),
            degree: edu.degree?.trim() || null,
            start_date: edu.start_date ? new Date(edu.start_date).toISOString() : null,
            end_date: edu.end_date ? new Date(edu.end_date).toISOString() : null,
          };
          
          // Only include id if it exists
          if (edu.id) {
            return { ...baseData, id: edu.id };
          }
          return baseData;
        });

        const { error: upsertError } = await supabaseClient
          .from("education")
          .upsert(educationData, { 
            onConflict: 'id',
            ignoreDuplicates: false 
          });
        
        if (upsertError) throw upsertError;
      } else if (existingEducation && existingEducation.length > 0) {
        // If no valid education but there are existing ones, delete all
        const { error: deleteError } = await supabaseClient
          .from("education")
          .delete()
          .eq('cv_id', portfolioId);
        if (deleteError) throw deleteError;
      }

      // Handle SKILLS - FIXED: Don't include id if it's undefined
      const validSkills = skills.filter(skill => skill.name?.trim());
      
      // Get IDs of valid skills
      const currentSkillIds = validSkills
        .map(skill => skill.id)
        .filter(Boolean) as string[];
      
      // Delete orphaned skills
      const orphanedSkillIds = (existingSkills || [])
        .map(skill => skill.id)
        .filter(id => !currentSkillIds.includes(id));
      
      if (orphanedSkillIds.length > 0) {
        const { error: deleteError } = await supabaseClient
          .from("skills")
          .delete()
          .in('id', orphanedSkillIds);
        if (deleteError) throw deleteError;
      }

      // Upsert valid skills
      if (validSkills.length > 0) {
        const skillsData = validSkills.map(skill => {
          const baseData = {
            cv_id: portfolioId,
            name: skill.name.trim(),
            level: skill.level?.trim() || null,
          };
          
          // Only include id if it exists (for updates)
          if (skill.id) {
            return { ...baseData, id: skill.id };
          }
          return baseData; // New record, let DB generate ID
        });

        console.log("Saving skills:", skillsData); // Debug log

        const { error: upsertError } = await supabaseClient
          .from("skills")
          .upsert(skillsData, { 
            onConflict: 'id',
            ignoreDuplicates: false 
          });
        
        if (upsertError) {
          console.error("Skills upsert error:", upsertError);
          throw upsertError;
        }
      } else if (existingSkills && existingSkills.length > 0) {
        // If no valid skills but there are existing ones, delete all
        const { error: deleteError } = await supabaseClient
          .from("skills")
          .delete()
          .eq('cv_id', portfolioId);
        if (deleteError) throw deleteError;
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (err: any) {
      console.error("Save error:", err);
      setError(err.message || "Failed to save portfolio");
    } finally {
      setSaving(false);
    }
  };

  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        cv_id: id || "",
        company: "",
        position: "",
        start_date: new Date().toISOString(),
        end_date: null,
        description: "",
      },
    ]);
  };

  const removeExperience = (index: number) => {
    const newExps = [...experiences];
    newExps.splice(index, 1);
    setExperiences(newExps);
  };

  const updateExperience = (index: number, field: keyof Experience, value: any) => {
    const newExps = [...experiences];
    newExps[index] = { ...newExps[index], [field]: value };
    setExperiences(newExps);
  };

  const addEducation = () => {
    setEducation([
      ...education,
      {
        cv_id: id || "",
        school: "",
        degree: "",
        start_date: null,
        end_date: null,
      },
    ]);
  };

  const removeEducation = (index: number) => {
    const newEdus = [...education];
    newEdus.splice(index, 1);
    setEducation(newEdus);
  };

  const updateEducation = (index: number, field: keyof Education, value: any) => {
    const newEdus = [...education];
    newEdus[index] = { ...newEdus[index], [field]: value };
    setEducation(newEdus);
  };

  const addSkill = () => {
    setSkills([
      ...skills,
      {
        cv_id: id || "",
        name: "",
        level: "",
      },
    ]);
  };

  const removeSkill = (index: number) => {
    const newSkills = [...skills];
    newSkills.splice(index, 1);
    setSkills(newSkills);
  };

  const updateSkill = (index: number, field: keyof Skill, value: any) => {
    const newSkills = [...skills];
    newSkills[index] = { ...newSkills[index], [field]: value };
    setSkills(newSkills);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in</h1>
          <p className="text-gray-600">You need to be logged in to create or edit your portfolio.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900">
            {id ? "Edit My Portfolio" : "Create My Portfolio"}
          </h1>
          {id && (
            <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded">
              Portfolio ID: {id.substring(0, 8)}...
            </div>
          )}
        </div>

        {/* Title & Summary */}
        <div className="mb-8">
          <input
            placeholder="Portfolio Title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-3 rounded-lg mb-4 text-lg font-semibold bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
          />
          <textarea
            placeholder="Summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full border p-3 rounded-lg h-32 bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none resize-vertical"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Experiences & Education */}
          <div className="md:col-span-2 space-y-8">
            {/* Experiences */}
            <section className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Experience</h2>
                <button
                  onClick={addExperience}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200"
                >
                  + Add Experience
                </button>
              </div>
              
              <div className="space-y-6">
                {experiences.map((exp, idx) => (
                  <div key={exp.id || `exp-${idx}`} className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Experience #{idx + 1}</h3>
                      <button
                        onClick={() => removeExperience(idx)}
                        className="px-3 py-1 text-sm bg-red-100 text-red-700 hover:bg-red-200 rounded transition"
                      >
                        Remove
                      </button>
                    </div>
                    
                    <input
                      placeholder="Position *"
                      value={exp.position}
                      onChange={(e) => updateExperience(idx, 'position', e.target.value)}
                      className="w-full border p-3 rounded-lg mb-3 bg-gray-50 text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    />
                    <input
                      placeholder="Company *"
                      value={exp.company}
                      onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                      className="w-full border p-3 rounded-lg mb-3 bg-gray-50 text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                        <input
                          type="date"
                          value={formatDateInput(exp.start_date)}
                          onChange={(e) => updateExperience(idx, 'start_date', e.target.value)}
                          className="w-full border p-3 rounded-lg bg-gray-50 text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <input
                          type="date"
                          value={formatDateInput(exp.end_date)}
                          onChange={(e) => updateExperience(idx, 'end_date', e.target.value || null)}
                          className="w-full border p-3 rounded-lg bg-gray-50 text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                        />
                      </div>
                    </div>
                    <textarea
                      placeholder="Description"
                      value={exp.description || ""}
                      onChange={(e) => updateExperience(idx, 'description', e.target.value)}
                      className="w-full border p-3 rounded-lg bg-gray-50 text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none h-32 resize-vertical"
                    />
                  </div>
                ))}
                
                {experiences.length === 0 && (
                  <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                    No experiences added yet. Click "Add Experience" to get started.
                  </div>
                )}
              </div>
            </section>

            {/* Education */}
            <section className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Education</h2>
                <button
                  onClick={addEducation}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200"
                >
                  + Add Education
                </button>
              </div>
              
              <div className="space-y-6">
                {education.map((edu, idx) => (
                  <div key={edu.id || `edu-${idx}`} className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Education #{idx + 1}</h3>
                      <button
                        onClick={() => removeEducation(idx)}
                        className="px-3 py-1 text-sm bg-red-100 text-red-700 hover:bg-red-200 rounded transition"
                      >
                        Remove
                      </button>
                    </div>
                    
                    <input
                      placeholder="School *"
                      value={edu.school}
                      onChange={(e) => updateEducation(idx, 'school', e.target.value)}
                      className="w-full border p-3 rounded-lg mb-3 bg-gray-50 text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    />
                    <input
                      placeholder="Degree"
                      value={edu.degree || ""}
                      onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                      className="w-full border p-3 rounded-lg mb-3 bg-gray-50 text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                          type="date"
                          value={formatDateInput(edu.start_date)}
                          onChange={(e) => updateEducation(idx, 'start_date', e.target.value || null)}
                          className="w-full border p-3 rounded-lg bg-gray-50 text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <input
                          type="date"
                          value={formatDateInput(edu.end_date)}
                          onChange={(e) => updateEducation(idx, 'end_date', e.target.value || null)}
                          className="w-full border p-3 rounded-lg bg-gray-50 text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                {education.length === 0 && (
                  <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                    No education entries added yet.
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right Column - Skills */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 sticky top-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Skills</h2>
                <button
                  onClick={addSkill}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200"
                >
                  + Add Skill
                </button>
              </div>
              
              <div className="space-y-4">
                {skills.map((skill, idx) => (
                  <div key={skill.id || `skill-${idx}`} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium text-gray-800">Skill #{idx + 1}</h3>
                      <button
                        onClick={() => removeSkill(idx)}
                        className="px-2 py-1 text-xs bg-red-100 text-red-700 hover:bg-red-200 rounded transition"
                      >
                        Remove
                      </button>
                    </div>
                    <input
                      placeholder="Skill Name *"
                      value={skill.name}
                      onChange={(e) => updateSkill(idx, 'name', e.target.value)}
                      className="w-full border p-3 rounded-lg mb-3 bg-gray-50 text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    />
                    <input
                      placeholder="Level (e.g., Beginner, Intermediate, Expert)"
                      value={skill.level || ""}
                      onChange={(e) => updateSkill(idx, 'level', e.target.value)}
                      className="w-full border p-3 rounded-lg bg-gray-50 text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    />
                  </div>
                ))}
                
                {skills.length === 0 && (
                  <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                    No skills added yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Save Button & Status */}
        <div className="mt-12 p-6 bg-white rounded-xl shadow-md border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex-1">
              <p className="text-gray-600">
                Make sure all required fields (marked with *) are filled before saving.
              </p>
              {success && (
                <div className="mt-2 p-3 bg-green-50 text-green-700 rounded-lg border border-green-200">
                  ✓ Portfolio saved successfully!
                </div>
              )}
              {error && (
                <div className="mt-2 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
                  ⚠ {error}
                </div>
              )}
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                "Save Portfolio"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}