import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

@NgModule({ // defines this as an Angular Module
  declarations: [  // which of our components belong to this module
    AppComponent
  ],
  imports: [ // external modules that we want to have available to all components that belong to this module
    BrowserModule
  ],
  bootstrap: [AppComponent] //startup component of our application; should contain selector we use in index.html file
})
export class AppModule { }
