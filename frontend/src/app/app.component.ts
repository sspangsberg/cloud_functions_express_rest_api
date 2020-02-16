import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  exampleProducts = [];


  ngOnInit() {   
    this.selectAll();
  }

  async selectAll() {
    try {
      console.log(environment.readAll);
      console.log('calling read all endpoint');

      this.exampleProducts = [];
      const output = await fetch(environment.readAll);
      const outputJSON = await output.json();
      this.exampleProducts = outputJSON;
      console.log('Success');
      console.log(outputJSON);
    } catch (error) {
      console.log(error);
    }
  }

  // really this is create but the flow is that
  // click the "create item" button which appends a blank value to the array, then click save to actually create it permanently
  async saveProduct(product: any) {
    try {
      console.log(environment.create);
      console.log('calling create item endpoint with: ' + product.name);

      const requestBody = {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price
      };

      const createResponse =
        await fetch(environment.create, {
          method: 'POST',
          body: JSON.stringify(requestBody),
          headers:{
            'Content-Type': 'application/json'
          }
        });
      console.log('Success');
      console.log(createResponse.status);

      // call select all to update the table
      this.selectAll();
    } catch (error) {
      console.log(error);
    }
  }

  async updateProduct(product: any) {
    try {
      console.log(environment.update);
      console.log('calling update endpoint with id ' + product.id + ' and value "' + product.name);

      const requestBody = {
        name: product.name,
        description: product.description,
        price: product.price
      };

      const updateResponse =
        await fetch(environment.update + product.id, {
          method: 'PUT',
          body: JSON.stringify(requestBody),
          headers:{
            'Content-Type': 'application/json'
          }
        });
      console.log('Success');
      console.log(updateResponse.status);

      // call select all to update the table
      this.selectAll();
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProduct(product: any) {
    try {
      console.log(environment.delete);
      console.log('calling delete endpoint with id ' + product.id);

      const deleteResponse =
        await fetch(environment.delete + product.id, {
          method: 'DELETE',
          headers:{
            'Content-Type': 'application/json'
          }
        });

      console.log('Success');
      console.log(deleteResponse.status);

      // call select all to update the table
      this.selectAll();
    } catch (error) {
      console.log(error);
    }
  }

  createProduct() {    

    this.exampleProducts.push({
      id: '',
      name: '',
      description: '',
      price: 0,
      save: true
    });
  }

}
