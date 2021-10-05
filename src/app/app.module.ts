import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { StorageServiceModule } from 'ngx-webstorage-service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';

import { DashboardComponent } from './dashboard/dashboard.component';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatGridListModule } from '@angular/material/grid-list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { MatListModule } from '@angular/material/list';
import { HttpClientModule } from '@angular/common/http';
import { PriceComponent } from './components/price/price.component';
import { BalanceComponent } from './components/balance/balance.component';
import { environment } from 'src/environments/environment';
import { ReversePipe } from './pipes/reverse.pipe';
import { OrderComponent } from './components/order/order.component';
import { FlexLayoutModule } from '@angular/flex-layout';

const config: SocketIoConfig = { url: environment.serverUrl, options: {} };

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    PriceComponent,
    BalanceComponent,
    ReversePipe,
    OrderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    StorageServiceModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatOptionModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatGridListModule,
    MatSliderModule,
    MatListModule,
    HttpClientModule,
    SocketIoModule.forRoot(config),
    FlexLayoutModule.withConfig({
      useColumnBasisZero: false,
      printWithBreakpoints: ['md', 'lt-lg', 'lt-xl', 'gt-sm', 'gt-xs']
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
