import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private http:HttpClient) { }

  getServices(){
    return this.http.get('http://localhost:8080/config/services', {observe: 'response'});
  }

  createService(data:any){
    return this.http.post('http://localhost:8080/config/services', data, {observe: 'response'});
  }

  updateService(data:any){
    return this.http.put('http://localhost:8080/config/services', data, {observe: 'response'});
  }

  deleteService(data:any){
    return this.http.delete('http://localhost:8080/config/services/'+data.id, {observe: 'response'});
  }

  getPlans(){
    return this.http.get('http://localhost:8080/config/plans', {observe: 'response'});
  }

  createPlan(data:any){
    return this.http.post('http://localhost:8080/config/plans', data, {observe: 'response'});
  }

  updatePlan(data:any){
    return this.http.put('http://localhost:8080/config/plans', data, {observe: 'response'});
  }

  deletePlan(data:any){
    return this.http.delete('http://localhost:8080/config/plans/'+data.id, {observe: 'response'});
  }

}
