import { jsDocComment } from '@angular/compiler';
import { Content } from '@angular/compiler/src/render3/r3_ast';
import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { saveAs } from 'file-saver';
import { resolve } from 'url';
import { SelectMultipleControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ZadanieRekrutacyjne';
  urlJokesLimited = 'http://api.icndb.com/jokes/random?limitTo='
  urlJokes = 'http://api.icndb.com/jokes/random';
  urlCategories = 'http://api.icndb.com/categories';
  categories: string[] = ["None"];
  joke: string  =""
  impersonate: string = "Chuck Norris"
  counter:number = 0
  jokeslist:string = ""
  constructor(private http: HttpClient)
  {
    this.http.get(this.urlJokes).toPromise().then(data =>{
      this.joke = "\"" + Object.values(data)[1].joke + "\""
    })

    this.http.get(this.urlCategories).toPromise().then(data =>{
      for( let i in Object.values(data)[1])
      {
        this.categories.push(Object.values(data)[1][i])
      }
  })
}
  updateName(event:any)
  {
    let tmp = event.target.value
    if(tmp != "")
      this.impersonate= tmp

    else
      this.impersonate= "Chuck Norris"

  }
  del()
  {
    if(this.counter>0)
      this.counter -=1
    else
      this.counter =0
      console.log(this.counter)
  }
  add()
  {
    this.counter+=1
    console.log(this.counter)

  }
   async saveJokes()
  {
    let tmp1:string  =""
    let flag = this.jokeslist
    var FileSaver = require('file-saver');
    for(let i=0 ; i<this.counter; i+=1)
    {
      this.http.get(this.urlJokes).toPromise().then(data =>{
        let tmp  ="\""+ Object.values(data)[1].joke+ "\""+"\n"
        tmp1 += tmp.replace(/Chuck Norris/, this.impersonate)
      })
    }
    while(flag == this.jokeslist)
    {
      await new Promise(f => setTimeout(f, 1000));
      this.jokeslist += tmp1

    }
    var blob = new Blob([this.jokeslist], {type: "text/plain;charset=utf-8"});
    FileSaver.saveAs(blob, "Jokes.txt");
    this.jokeslist = ""
    this.counter = 0
  }
  getJokes()
  {
    let x = document.getElementById("categories") as HTMLSelectElement
    let sel = x.selectedIndex;
    let opt = x.options[sel].text;
    console.log(opt)
    if(opt == "None")
    {
        this.http.get(this.urlJokes).toPromise().then(data =>{
        let tmp  ="\""+ Object.values(data)[1].joke+ "\""
        tmp = tmp.replace(/Chuck Norris/, this.impersonate)
        this.joke =tmp
        })
    }
    else{
        this.http.get(this.urlJokesLimited + "[" + opt + "]").toPromise().then(data =>{
          let tmp  ="\""+ Object.values(data)[1].joke+ "\""
          tmp = tmp.replace(/Chuck Norris/, this.impersonate)
          this.joke =tmp
        })
    }
  }
}


