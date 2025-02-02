import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'


import { AppComponent } from './app.component';
import { WelcomeComponent } from './home/welcome.component';
import { RouterModule } from '@angular/router';
import { ProductModule } from './products/product.module';

@NgModule({ // defines this as an Angular Module
  declarations: [  // which of our components belong to this module
    AppComponent,
    WelcomeComponent
  ],
  imports: [ // external modules that we want to have available to all components that belong to this module
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: 'welcome', component: WelcomeComponent },
      { path: '', redirectTo: 'welcome', pathMatch: 'full' },
      { path: '**', redirectTo: 'welcome', pathMatch: 'full' }
    ]),
    ProductModule
  ],
  bootstrap: [AppComponent] //startup component of our application; should contain selector we use in index.html file
})
export class AppModule { }


// this bootstraps our app component