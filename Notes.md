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



### Observables

    - collection of items over time, used to deal with HTTP requests
    - need to use rxjs library
    - create a method in the SERVICE class to deal with observables emitted and any errors
            --> call on HttpClient in constructor
    - in the component that needs the data from the backend (or url), you need to SUBSCRIBE to that observable (ngOnInit) and then UNSUBSCRIBE as well (ngOnDestroy)

    1. next = occurs when next item is emitted (and provides emitted item…like tracking key presses, each time a key is pressed, the observable emits a next notification and provides the pressed character)
	2. error = an error occurred (error info provided) and no more items are emitted
	3. complete = if there are no more items to emit


		-> we can pipe emitted items through a set of operators to modify/transform them (lowercase, etc)
			-would have to import Observable and operators, example (see screenshot in Getting Started note):
				import { Observable } from ‘rxjs’;
				import { map, filter } from ‘rxjs/operators’






### Routing
    —> to create a new component using the CLI (will automatically updated app module):
		- ng g c products/product-detail - - flat
			—> g = generate
			—> c = component
			—> products/product-detail = path where we want our component, product-detail, to sit
			—> two dashes followed by flat = do not create a folder specifically for this component

	<router-outlet> directive get placed in the host component’s template; the routed component’s view then appears in this location
		->Whenever a route is activated, the associated component’s view is displayed here

	-CHECKLIST FOR ROUTING

		-> 	Define base element (in index.html, usually)
				<head>
					…
					<base href=“/“>
				</head>

		-> Add RouterModule
			@NgModule({
				imports: […,
					RouterModule.forRoot([ ])
				],
				declarations: […],
				bootstrap: [ AppComponent]
			})
			export class AppModule { }

		-> Add each route to forRoot array
			RouterModule.forRoot([
				{ path: ‘products’, component: ProductListComponent },
				{ path: ‘products/:id’, component: ProductDetailComponent },
				{ path: ‘welcome’, component: WelcomeComponent},
				{ path: ‘’, redirectTo: ‘welcome’, pathMatch: ‘full’ },
				{ path: ‘**’, redirectTo: ‘welcome’, pathMatch: ‘full’ }
			])

		-> Identify which actions to tie to which routes
		-> Add the RouterLink directive as an attribute to any clickable element in a component’s template
			(bind to a link parameters array where first element is the path and all other elements are route 
			parameters)
				<ul>
					<li><a [routerLink]=“[‘/welcome’]”>Home</a></li>
					<li><a [routerLink]=“[‘/products’]”>Product List</a></li>
				</ul>
			

		-> Add the RouterOutlet directive to identify where to display the routed component’s view (most often 
	specified in the host component’s template)
				<ul>
					<li><a [routerLink]=“[‘/welcome’]”>Home</a></li>
					<li><a [routerLink]=“[‘/products’]”>Product List</a></li>
				</ul>
				<router-outlet></router-outlet>

    - Miscellaneous stuff with regards to Routing

		-> Safe navigation operator = ?
			-guards against null and undefined values when navigating an object’s properties
			-if the product object is null or undefined, this operator returns null and does not attempt to access the property (no undefined property error)
			- example: product?.productName
			- does not work with ngModel two-way binding
			- can also be tedious when displaying many properties

		->To activate a route with CODE

			-use the ROUTER SERVICE and define it as a dependency on the constructor (import into the class
	        in which you need to use the route)

			-create a method that calls the navigate method of the Router service and pass in the link parameters
	        array
			
			import { Router } from ‘@angular/core’;
			…
			constructor(private router: Router) { }
			onBack(): void {
				this.router.navigate([‘/products’]);
			}

			-add a user interface element and use event binding to bind to the created method

				<button (click)=‘onBack( )’>Back</button>


-PROTECTING ROUTES WITH GUARDS

	-> Build a guard service
		-Implement the guard type (CanActivate)
		-Create the method (canActivate()) 
		-Register the guard service provider
			-use the providedIn property
			
			import { Injectable } from ‘@angular/core’;
			import { CanActivate } from ‘@angular/router’;

			@Injectable ({ 
				providedIn: ‘root’
			})
			export class ProductDetailGuard implements CanActivate {
				canActivate(): boolean {…}
			}

		-Add the guard to the desired route
	
		{ path: ‘products/:id’, canActivate: [ ProductDetailGuard ], component: ProductDetailComponent }


### Modules

	->A class with an NgModule decorator
	->organize the pieces of an app -> arrange them into blocks
	->extend the app with capabilities from external libraries
	->provide a template resolution environment
	->aggregate classes and re-export

	-Every app must bootstrap at least one component, the root application component
	-The bootstrap array should only be used in the root application module, AppModule
	
	-DECLARATIONS ARRAY:
		->to define the components, directives and pipes that belong to a module
		->every comp, directive and pipe that is created must belong to ONE AND ONLY ONE angular module
		->only declare components, directives, pipes
		->all components, directives, pipes are private by default and only accessible to other components, 
	directives, pipes declared in the same module (can share by exporting)
		->the angular module provides the template resolution environment for its component templates
	
	-EXPORTS ARRAY:
		->allows us to share a module’s components, directives and pipes with other modules
		->can re-export modules to re-export components, directives, pipes
		->can export something without including it in the imports array
		->is often only used by the Shared Module
		
	-IMPORTS ARRAY:
		->can import modules (even 3rd party) to use capabilities
		-> for each component declared in the module, add to the imports array what is needed by the 
	component’s template
		->importing a module does NOT provide access to its imported modules (imports are NOT INHERITED) 
	unless a module re-exported its imported modules
		->use the imports array to register services provided by Angular or third-party modules (usually, we import 
	module in the AppModule to ensure its services are registered one time)

	
	- to create a new module using the CLI

	ng g m products/product - -flat -m app
		->g = generate
		->m = module
		->products/product = put it in the products folder and call it ProductModule
		-> - -flat = do not create a folder for it
		-> -m app = add it to the imports array of AppModule

	when not adding to AppModule:  ng g m shared/shared --flat -m products/product.module

	-SHARED MODULE
		->organize commonly used pieces of our application
		->export those pieces to share them



### Angular CLI

	-uses SCHEMATICS
		-> a template-based code generator that supports complex logic
		-> a set of instructions for transforming a software project by generating or modifying code (like a 
	(blueprint)
		-> examples: 
			Components: ng g c <name>
			Directives: ng g d <name>
			Route guards: ng g g <name>
			Interfaces: ng g i <name>
			Modules: ng g m <name>
			Pipes: ng g p <name>
			Services: ng g s <name>
	
	-can test code with ng test
	
	-Building the app
		-> need to do some “tree shaking”…cleaning up code (get rid of dead branches)
		-> ng build does this for us
		-> bundles returned have a hash…this is done for CACHE BUSTING
								-> every time we change something in our code it needs to be redeployed
							to the server…we expect new version of files to be downloaded by the browser when
							a user access our app…for performance reasons, the browser may have cached 
							those files…by appending a hash, the browser will download the latest version of 
							files b/c the hashed file names will not match the cached file names

		-> a dist folder will be created with all the bundles