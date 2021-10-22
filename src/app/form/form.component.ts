import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorMsg } from '../models/error';
import { SimpleField, GroupField, FormValidator, Field } from '../models/form';
import { DataService } from '../services/data-service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  _data: Array<SimpleField | GroupField>;
  errorMsg: ErrorMsg = {
    email: "Please, provide a valid email!",  
    required: "This field is required!"
  };
  form: FormGroup;
  formControls: Array<FormControl> = [];
  valid = true;
  path: string | undefined;


  get data () {
    return this._data;
  }

  set data (data) {
    this._data = data;
  }

  constructor(private dataService: DataService,
              private formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.path = this.route.snapshot?.routeConfig?.path;
    if (this.path === 'edit' && this.dataService.value === undefined) {
      this.router.navigate(['form']);
    }
    this.data = this.dataService.data;
    this.initializeForm();
  }

  initializeForm() {
    this.form = new FormGroup({});

    this.data.forEach((item: SimpleField | GroupField) => {
      if (item.fieldType === 'simple') {
        this.form.addControl(item.field!.name, this.formBuilder.control('', this.createValidatorArray(item.field.validators)));
      }

      if (item.fieldType === 'group' && item.type === "radio") {
        let checked: string = '';
        item.field.forEach(fieldItem => {
          if (fieldItem.checked) {
            checked = fieldItem.value as string;
          }
        })
        
        this.form.addControl(item.name, this.formBuilder.control(checked, this.createValidatorArray(item.validators)));
      }

      if (item.fieldType === 'group' && item.type === "checkbox") {   
        this.form.addControl(item.name, new FormArray([], this.createValidatorArray(item.validators)));
      }

    });

    if (this.path === 'edit') {
      this.fillOldData();
    }

  }

  fillOldData() {
    const oldData = this.dataService.value;
    if (oldData) {
      for (const [key, value] of Object.entries(oldData)) {
        
        if (!(typeof value === 'string')) {
          const checkArray: FormArray = this.form.get(key) as FormArray;

          (value as []).forEach((element: string) => {
            
            checkArray.push(new FormControl(element));
            
            let check = this.data.find((fieldElement: GroupField | SimpleField) => {
              return (fieldElement.fieldType === 'group' && fieldElement.name === key);
            });
            
            (check?.field as Array<Field>).forEach(item => {
              if (item.value === element) {
                item.checked = true;
                
                if (item.onValue) {
                  this.form.addControl(item.onValue.name, this.formBuilder.control(''));
                }
              }
            });
          });
        } else {
          this.form.patchValue({[key]: value});
        }
      }
    }
  }

  createValidatorArray(validators: FormValidator) {
    const result = [];
    for (const [key, value] of Object.entries(validators)) {
      switch (key) {
        case 'required':
          if (value) {
            result.push(Validators.required);
          }
          break;
        case 'email':
          if (value) {
            result.push(Validators.email);
          }
          break;
        case 'regex':
          if (value) {
            result.push(Validators.pattern(value));
          }
          break;
        default:
          break;
      }
    }

    return result;
  }

  onRadioChange(item: Field) {
    item.checked = true;
    this.form.patchValue({[item.name]: item.value})
  }

  onCheckboxChange(event: Event, name: string, item: Field) {
    const target = event.target as HTMLInputElement;
    const checkArray: FormArray = this.form.get(name) as FormArray;

    if (target.checked) {
      item.checked = true;
      checkArray.push(new FormControl(target.value));
      if (item.onValue) {
        this.form.addControl(item.onValue.name, this.formBuilder.control(''));
      }
    } else {
      item.checked = false;
      if (item.onValue) {
        this.form.removeControl(item.onValue.name);
      }

      const indexToRemove = checkArray.controls.findIndex((item: any) => item.value === target.value);
      checkArray.removeAt(indexToRemove);

    }
  }

  onSubmit() {
    this.dataService.value = this.form.value;
    if (this.form.valid) {
      this.router.navigate(['display']);
    }
      
    console.log(this.form.value);
  }

}
