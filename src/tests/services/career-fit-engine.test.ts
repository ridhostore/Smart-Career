import { describe, test, expect } from "vitest";
import { computeCareerScore, getCareerFitCategory } from "@/services/career-fit-engine";

describe("Career Fit Engine", () => {
  describe("getCareerFitCategory", () => {
    test("should return excellent for scores >= 90", () => {
      expect(getCareerFitCategory(95)).toBe("excellent");
      expect(getCareerFitCategory(90)).toBe("excellent");
    });

    test("should return good for scores between 80 and 89", () => {
      expect(getCareerFitCategory(85)).toBe("good");
      expect(getCareerFitCategory(80)).toBe("good");
    });

    test("should return moderate for scores between 70 and 79", () => {
      expect(getCareerFitCategory(75)).toBe("moderate");
      expect(getCareerFitCategory(70)).toBe("moderate");
    });

    test("should return weak for scores between 60 and 69", () => {
      expect(getCareerFitCategory(65)).toBe("weak");
      expect(getCareerFitCategory(60)).toBe("weak");
    });

    test("should return poor for scores < 60", () => {
      expect(getCareerFitCategory(55)).toBe("poor");
      expect(getCareerFitCategory(30)).toBe("poor");
    });
  });

  describe("computeCareerScore", () => {
    test("should compute correct weighted average score", () => {
      const grades = [
        { courseId: "c1", grade: 80 },
        { courseId: "c2", grade: 90 },
      ];
      const weights = [
        { courseId: "c1", weight: 0.4 },
        { courseId: "c2", weight: 0.6 },
      ];
      // 80*0.4 + 90*0.6 = 32 + 54 = 86
      expect(computeCareerScore(grades, weights)).toBe(86);
    });

    test("should return 0 when weights sum is 0", () => {
      const grades = [{ courseId: "c1", grade: 80 }];
      const weights: { courseId: string; weight: number }[] = [];
      expect(computeCareerScore(grades, weights)).toBe(0);
    });

    test("should ignore grades that do not have matching weight", () => {
      const grades = [
        { courseId: "c1", grade: 80 },
        { courseId: "c2", grade: 95 },
      ];
      const weights = [
        { courseId: "c1", weight: 1.0 },
      ];
      expect(computeCareerScore(grades, weights)).toBe(80);
    });
  });
});
