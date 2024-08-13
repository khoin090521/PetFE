import { Injectable } from '@angular/core';

interface SearchResult {
    gmail: string;
    full_name: string;
    address: string;
    phone_number: string;
    roles: string[];
    status: number;
  }

@Injectable({
  providedIn: 'root'
})
export class SharedService {
    searchResult?: SearchResult;
    setData(searchResult?: SearchResult) {
        this.searchResult = searchResult;
    }
    getData() {
        return this.searchResult;
    }
}