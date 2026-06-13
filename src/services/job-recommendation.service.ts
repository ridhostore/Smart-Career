/**
 * Job Recommendation Engine
 * Generates job search URLs for LinkedIn, JobStreet, and Glints
 * based on career target keywords
 */

import { prisma } from "@/lib/prisma";
import type { JobRecommendationLinks } from "@/types";

// ============================================================
// URL GENERATORS
// ============================================================

export function generateLinkedInUrl(keyword: string): string {
  const encoded = encodeURIComponent(keyword);
  return `https://www.linkedin.com/jobs/search/?keywords=${encoded}&location=Indonesia&f_TPR=r2592000`;
}

export function generateJobStreetUrl(keyword: string): string {
  const encoded = encodeURIComponent(keyword);
  return `https://www.jobstreet.co.id/jobs/${encoded.toLowerCase().replace(/%20/g, "-")}`;
}

export function generateGlintsUrl(keyword: string): string {
  const encoded = encodeURIComponent(keyword);
  return `https://glints.com/id/opportunities/jobs/explore?keyword=${encoded}&country=ID`;
}

// ============================================================
// PLATFORM METADATA
// ============================================================

export const JOB_PLATFORMS = [
  {
    id: "linkedin",
    name: "LinkedIn Jobs",
    logo: "/images/linkedin-logo.svg",
    description: "Platform profesional terbesar",
    color: "#0A66C2",
    generateUrl: generateLinkedInUrl,
  },
  {
    id: "jobstreet",
    name: "JobStreet",
    logo: "/images/jobstreet-logo.svg",
    description: "Portal kerja terpopuler di Asia Tenggara",
    color: "#E60278",
    generateUrl: generateJobStreetUrl,
  },
  {
    id: "glints",
    name: "Glints",
    logo: "/images/glints-logo.svg",
    description: "Platform karir untuk generasi muda",
    color: "#F5642F",
    generateUrl: generateGlintsUrl,
  },
] as const;

// ============================================================
// MAIN SERVICE
// ============================================================

/**
 * Generate job recommendation links for a career target
 */
export function generateJobLinks(careerTarget: {
  name: string;
  linkedinKeyword: string;
  jobstreetKeyword: string;
  glintsKeyword: string;
}): JobRecommendationLinks {
  return {
    careerTarget: careerTarget.name,
    linkedin: generateLinkedInUrl(careerTarget.linkedinKeyword),
    jobstreet: generateJobStreetUrl(careerTarget.jobstreetKeyword),
    glints: generateGlintsUrl(careerTarget.glintsKeyword),
  };
}

/**
 * Save and return job recommendations for a student
 */
export async function getJobRecommendations(
  studentProfileId: string,
): Promise<JobRecommendationLinks[]> {
  const studentProfile = await prisma.studentProfile.findUnique({
    where: { id: studentProfileId },
    include: {
      studyProgram: {
        include: {
          careerTargets: {
            where: { deletedAt: null, isActive: true },
          },
        },
      },
    },
  });

  if (!studentProfile) throw new Error("Student profile not found");

  const recommendations: JobRecommendationLinks[] = [];

  for (const careerTarget of studentProfile.studyProgram.careerTargets) {
    const links = generateJobLinks(careerTarget);
    recommendations.push(links);

    // Persist to DB (upsert)
    await prisma.jobRecommendation.upsert({
      where: {
        // Use a composite-like approach — find first then create/update
        id: (
          await prisma.jobRecommendation.findFirst({
            where: { studentProfileId, careerTargetName: careerTarget.name },
          })
        )?.id ?? "00000000-0000-0000-0000-000000000000",
      },
      create: {
        studentProfileId,
        careerTargetName: careerTarget.name,
        linkedinUrl: links.linkedin,
        jobstreetUrl: links.jobstreet,
        glintsUrl: links.glints,
      },
      update: {
        linkedinUrl: links.linkedin,
        jobstreetUrl: links.jobstreet,
        glintsUrl: links.glints,
      },
    });
  }

  return recommendations;
}

/**
 * Alias for getJobRecommendations (used by student actions)
 */
export const generateJobRecommendations = getJobRecommendations;
