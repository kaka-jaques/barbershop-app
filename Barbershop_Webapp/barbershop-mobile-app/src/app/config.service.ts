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

}
