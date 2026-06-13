import { describe, test, expect } from "vitest";
import {
  generateLinkedInUrl,
  generateJobStreetUrl,
  generateGlintsUrl,
  generateJobLinks,
} from "@/services/job-recommendation.service";

describe("Job Recommendation Service", () => {
  describe("URL Generators", () => {
    test("should format LinkedIn search URL with encoded keywords", () => {
      const url = generateLinkedInUrl("financial analyst");
      expect(url).toContain("keywords=financial%20analyst");
      expect(url).toContain("location=Indonesia");
    });

    test("should format JobStreet URL with lowercase hyphenated slugs", () => {
      const url = generateJobStreetUrl("Financial Analyst");
      expect(url).toBe("https://www.jobstreet.co.id/jobs/financial-analyst");
    });

    test("should format Glints search URL with query keywords", () => {
      const url = generateGlintsUrl("auditor");
      expect(url).toContain("keyword=auditor");
      expect(url).toContain("country=ID");
    });
  });

  describe("generateJobLinks", () => {
    test("should construct object with all job site links mapped", () => {
      const careerTarget = {
        name: "Tax Consultant",
        linkedinKeyword: "tax-consultant",
        jobstreetKeyword: "tax consultant",
        glintsKeyword: "tax consultant",
      };

      const result = generateJobLinks(careerTarget);

      expect(result.careerTarget).toBe("Tax Consultant");
      expect(result.linkedin).toContain("keywords=tax-consultant");
      expect(result.jobstreet).toBe("https://www.jobstreet.co.id/jobs/tax-consultant");
      expect(result.glints).toContain("keyword=tax%20consultant");
    });
  });
});
