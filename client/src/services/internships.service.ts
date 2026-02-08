// InternshipsService.ts

// This service is responsible for handling internship requests.

import HttpService from "@/core/http.service";

export default class InternshipsService {
  private http: HttpService;

  constructor() {
    this.http = new HttpService();
  }

  // Get all internships
  public async getInternships(options?: any) {
    return this.http
      .service()
      .get<any>("internships", options);
  }

  // Get internship by id
  public async getInternship(id: string, options?: any) {
    return this.http
      .service()
      .get<any>(`internships/${id}`, options);
  }

  // Create internship
  public async createInternship(payload: any, options?: any) {
    return this.http
      .service()
      .post<any, any>("internships", payload, options);
  }

  // Update internship
  public async updateInternship(id: string, payload: any, options?: any) {
    return this.http
      .service()
      .put<any, any>(`internships/${id}`, payload, options);
  }

  // Delete internship
  public async deleteInternship(id: string, options?: any) {
    return this.http
      .service()
      .delete<any>(`internships/${id}`, options);
  }

  // Apply for internship
  public async applyForInternship(internshipId: string, options?: any) {
    return this.http
      .service()
      .post<any, any>(`internship/${internshipId}/apply`, {}, options);
  }

  // Get user applications
  public async getUserApplications(options?: any) {
    return this.http
      .service()
      .get<any>("internship/applications", options);
  }

  // Update application
  public async updateApplication(applicationId: string, payload: any, options?: any) {
    return this.http
      .service()
      .put<any, any>(`internship/applications/${applicationId}`, payload, options);
  }
}
