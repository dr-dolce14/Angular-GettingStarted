# Anatomy of an Angular Application

## APPLICATION = 
                Component + Component + Component ...
                       _____Services_____ (like accessing data from a backend server)



## COMPONENT
            - Template
                 -> HTML defining a view for the app (think of this as the UI)

            - Class (the code associated with the view, code behind user interface)
                -> PROPERTIES, or data elements, for binding to the view
                -> METHODS, perform actions for the view, like responding to a button click 
            
            - Metadata
                -> provides additional info about the component to Angular
                -> defined with a DECORATOR 
                                    |->  *function that adds metadata to a class, its members, or its method arguments;
                                         *scope is limited to the feature that it decorates
                                         *always prefixed with @
                                         *several built-in, like @Component




### To create a new Angular project:
    ng new <project_name> --prefix <some_prefix_is_optional>


### AppModule 
    - provides organization boundaries
    - template resolution environment


### Property Binding:
    <img [src] = 'product.imageUrl'>
    ( compare this to Interpolation --> <img src={{product.imageUrl}}> )


### Example of CUSTOM PIPE
- put this in a shared folder (or whatever folder your component that needs it is in, if it's just one component that needs it)...call it something like convert-to-spaces.pipe.ts (for this example)

import { PipeTransform } from "@angular/core";
import { Pipe } from "@angular/core";

@Pipe({
    name: 'convertToSpaces'
})

export class ConvertToSpacesPipe implements PipeTransform {

    transform(value: string, character: string): string {
        return value.replace(character, ' ')
    }

}


### Lifecycle hooks

2.    import { Component, OnInit } from '@angular/core';

1.    export class ProductListComponent implements OnInit {
        pageTitle: string = 'Product List';
        showImage: boolean = false;
        listFilter: string = 'cart';
        products: IProduct[] = [...]
    }

3.    ngOnInit(): void {
        console.log('In OnInit');
      }
    }
