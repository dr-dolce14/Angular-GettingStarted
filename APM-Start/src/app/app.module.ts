import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ProductListComponent } from './products/product-list.component';
import { ConvertToSpacesPipe } from './shared/convert-to-spaces.pipe';
import { StarComponent } from './shared/star.component';

@NgModule({ // defines this as an Angular Module
  declarations: [  // which of our components belong to this module
    AppComponent,
    ProductListComponent,
    ConvertToSpacesPipe,
    StarComponent
  ],
  imports: [ // external modules that we want to have available to all components that belong to this module
    BrowserModule,
    FormsModule
  ],
  bootstrap: [AppComponent] //startup component of our application; should contain selector we use in index.html file
})
export class AppModule { }



// this bootstraps our app component