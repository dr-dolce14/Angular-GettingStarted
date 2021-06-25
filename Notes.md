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








### Nesting Components

-When passing data TO a nested component, use the @Input decorator:

@Component({

    selector: 'pm-star',
    templateUrl: './star.component.html'

})

export class StarComponent {

    @Input() rating: number; 
    cropWidth: number;

}

-Then use property binding to pass data from the container to the nested component:
in product-list.component.html (this is the container component in which the star component is nested)

    <td>
        <pm-star [rating]='product.starRating'></pm-star>
    </td>


** The container component can ONLY bind to a nested component property marked with the @Input decorator (so only the 'rating' property above)

-If the nested component wants to send data back OUT to its container component it can emit an EVENT

    -> nested component must identify a property for that purpose using the @Output decorator (can be used to decorate any property in nested component class, but MUST BE AN EVENT)

    -> an event is defined with an EVENT EMITTER OBJECT and data passed along with it. 

@Component({

    selector: 'pm-star',
    templateUrl: './star.component.html',
    styleUrls: ['./star.component.css']

})

export class StarComponent implements OnChanges {

    @Input() rating: number = 0;
    cropWidth: number = 75;
    @Output() ratingClicked: EventEmitter<string> =
        new EventEmitter<string>();
        
}

-Then in the template of the nested component, you would add the (click) event to call on an OnClick() function

    <div class="crop"
            [style.width.px]="cropWidth"
            [title]="rating"
            (click) = 'onClick()'>
        <div style="width: 75px">
            <span class="fa fa-star"></span>
            <span class="fa fa-star"></span>
        </div>
    </div>

-The onClick() function is defined in the nested component class:
 
 onClick(): void {

    this.ratingClicked.emit('The rating ${this.rating} was clicked!); 

}

(but use BACKTICKS INSTEAD OF SINGLE QUOTES)

-Then with data binding (but using parentheses this time to signify two-way binding), you would bind the ratingClicked property to the container component's template and assign it a function that would be defined in the container component's class...here it is onRatingClicked. 


    <td>
        <pm-star [rating]='product.starRating'
        (ratingClicked)='onRatingClicked($event)'>
        </pm-star>
    </td>

*** the ($event) means that data is being transmitted via that event emitter

-Then the onRatingClicked() function needs to be defined in the container component's class:

 onRatingClicked(message: string): void {

    this.pageTitle = 'Product List: ' + message;

}


### Services

-Building a service involves four steps:
1. Create a file, like product.service.ts
2. Create the service class (use PascalCasing and append “Service” to the name)
3. Define the metadata with a decorator (the @Injectable decorator)
4. Import what we need

-in product.service.ts

import { Injectable } from "@angular/core";

import { IProduct } from "./product";

@Injectable({

    providedIn: 'root'

})

export class ProductService {

    getProducts(): IProduct[] {

        return [...list of products...]
    }

}

-Registering the service
	-> use Root application injector if the service is used throughout the application 
			-> in @Injectable decorator, set the providedIn property to ‘root’

	-> specific component’s injector if only that component uses the service
			-> in the component’s decorator, set the providers property to the service


-In any class that needs the service, specify the service as a DEPENDENCY
	-> use a CONSTRUCTOR parameter to define the dependency 
	-> the service will be injected when the component is instantiated

-in product-list.component.ts

Import statements....

@Component ({...selector, templateUrl, etc.})

export class ProductListComponent implements OnInit {

    declarations of data types...

    setter and getter ....

    filteredProducts: IProduct[] = [];

    products: IProduct[] = [];

    constructor (private productService: ProductService) {}


    (then to get the data from the service upon initialization of component:)

    ngOnInit(): void {

    this.products = this.productService.getProducts();

    this.filteredProducts = this.products;
    
  }


}


