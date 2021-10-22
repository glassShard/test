import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DisplayComponent } from './display/display.component';
import { FormComponent } from './form/form.component';

const routes: Routes = [
  { path: 'form', component: FormComponent, pathMatch: 'full' },
  { path: 'display', component: DisplayComponent, pathMatch: 'full' },
  { path: 'edit', component: FormComponent, pathMatch: 'full' },
  { path: '', component: FormComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
