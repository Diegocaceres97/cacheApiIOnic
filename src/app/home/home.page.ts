import { CachingService } from './../services/caching.service';
import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { LoadingController } from '@ionic/angular';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  users = null;
  joke = null;

  constructor(private apiService: ApiService,
    private loadingController: LoadingController,
    private cachingService: CachingService) {}

    async loadChuckJoke(forceRefresh: any){
      const loading = await this.loadingController.create({
        message : "Load data..."
      });

      await loading.present();

      this.apiService.getChuckJoke(forceRefresh).subscribe(res => {
        this.joke = res;
        loading.dismiss();
      })
    }

  async refreshUsers(event?:any){
    const loader = await this.loadingController.create({
      message: 'Loading data...'
    });
    await loader.present();

    const refresh = event ? true : false;

    this.apiService.getUsers(refresh).pipe(
      finalize(()=> {
        if(event){
          event.target.complete();
        }
        loader.dismiss();
      })
    ).subscribe( res => {
      this.users = res;
    })
  }
}
