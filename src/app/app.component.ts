import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import html2canvas from "html2canvas";

export interface Niyam {
  date: string;
  day: string;
  tithi: string;
  month: string;
  paksh: string;
  niyam: string;
  prabhu: string;
  mantra: string;
  background: string;
  kalyanak: string;
  is_pakshik_parv: boolean;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  @ViewChild('generatedImage', { static: false, read: ElementRef }) generatedImage!: ElementRef;
  
  title = 'channelNiyam';
  niyamList: Niyam[] = [];
  niyam: Niyam = {
    date: "",
    day: "",
    tithi: "",
    month: "",
    paksh: "",
    niyam: "",
    prabhu: "",
    mantra: "",
    background: "",
    kalyanak: "",
    is_pakshik_parv: false
  };

  date: string = "";

  constructor(
    private http: HttpClient
  ) {}

  ngOnInit() {
    let endpoint = "assets/json/niyam.json";
    this.http.get<Niyam[]>(endpoint).subscribe((data: Niyam[]) => {
      this.niyamList = data;
    });
  }

  dateChanged(event: any) {
    let dateArray = event.split("-");
    this.date = dateArray[2] + "/" + dateArray[1] + "/" + dateArray[0];
    this.getNiyam();
  }

  getNiyam() {
    for (let niyam of this.niyamList) {
      if (niyam.date == this.date) {
        this.niyam = niyam;
        break;
      }
    }
  }

  download() {
    html2canvas(this.generatedImage.nativeElement).then((canvas: any) => {
      canvas.toBlob((blob: any) => {
        let link = document.createElement("a");
        link.download = this.niyam.date.replace(/\//g, '_') + ".png";
        link.href = URL.createObjectURL(blob);
        link.click();
      },'image/png');
    });
  }

}
