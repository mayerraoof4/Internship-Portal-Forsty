export interface PostedInternship {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary: string;
  tags: string[];
  postedDate: string;
  status: "active" | "closed" | "draft";
  applicants?: number;
}

class PostedInternshipsService {
  private readonly localStorageKey = "postedInternships";

  getPostedInternships(): PostedInternship[] {
    const data = localStorage.getItem(this.localStorageKey);
    return data ? JSON.parse(data) : [];
  }

  addPostedInternship(internship: Omit<PostedInternship, "id" | "postedDate">): PostedInternship {
    const posted: PostedInternship = {
      ...internship,
      id: Date.now().toString(),
      postedDate: new Date().toISOString(),
      applicants: 0,
    };

    const current = this.getPostedInternships();
    const updated = [posted, ...current];
    localStorage.setItem(this.localStorageKey, JSON.stringify(updated));

    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent("postedInternshipsUpdated"));

    return posted;
  }

  updatePostedInternship(id: string, updates: Partial<PostedInternship>): PostedInternship | null {
    const internships = this.getPostedInternships();
    const index = internships.findIndex((i) => i.id === id);

    if (index === -1) return null;

    internships[index] = { ...internships[index], ...updates };
    localStorage.setItem(this.localStorageKey, JSON.stringify(internships));

    window.dispatchEvent(new CustomEvent("postedInternshipsUpdated"));

    return internships[index];
  }

  deletePostedInternship(id: string): boolean {
    const internships = this.getPostedInternships();
    const updated = internships.filter((i) => i.id !== id);

    if (updated.length === internships.length) return false;

    localStorage.setItem(this.localStorageKey, JSON.stringify(updated));

    window.dispatchEvent(new CustomEvent("postedInternshipsUpdated"));

    return true;
  }

  getPostedInternshipById(id: string): PostedInternship | null {
    const internships = this.getPostedInternships();
    return internships.find((i) => i.id === id) || null;
  }
}

export default PostedInternshipsService;
