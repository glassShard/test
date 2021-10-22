import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data-service';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent implements OnInit {
  value: any
  textToDisplay: string; 

  constructor(private dataService: DataService,
              private router: Router) { }

  ngOnInit(): void {
    this.value = this.dataService.value;
    console.log(this.value === undefined);
    if (this.value === undefined) {
      this.router.navigate(['']);
    } else {
      this.makeText();
    }    
  }

  makeText() {
    const birth = (new Date().getFullYear() - new Date(this.value.birth).getFullYear());
    let birthString;
    if (birth > 1) {
      birthString = `You are ${birth} years old.`;
    } else if (birth < 1 && birth >= 0) {
      birthString = `You have just born, you are not even one year old yet.`
    } else {
      birthString = `You have not been born yet.`
    }
    
    let hobbies = JSON.parse(JSON.stringify(this.value.hobbies));
    let hobbiesText;
    if (hobbies.includes('other')) {
      hobbies.splice(-1, 1);
      if (this.value.other) {
        const otherArray = this.value.other.split(',').map((element: string) => element.trim());
        hobbies = [...hobbies, ...otherArray];
      } 
    }
    console.log(hobbies);
    if (!hobbies.length) {
      hobbiesText = `You have some hobby, but it is not cooking, cycling, grill, or camping, and you do not want to tell it.`
    } else if (hobbies.length === 1) {
      hobbiesText = `your hobby is ${hobbies[0]}`;
    } else {
      hobbiesText = `your hobbies are ` + hobbies.reduce((acc: string, curr: string, index: number) => {
        if (index === hobbies.length - 1) {
          acc += ' and ' + curr;
          return acc;       
        }
        if (index === hobbies.length - 2) {
          return acc + curr;
        }
        return acc + curr + ', ';
      }, '');
    }

    this.textToDisplay = `Hello, your name is ${this.value.name}, and your email address is "${this.value.email}". ${birthString} You are ${this.value.sex}, and ${hobbiesText}.`;
  }

  onClickEdit() {
    this.router.navigate(['edit']);
  } 
}
