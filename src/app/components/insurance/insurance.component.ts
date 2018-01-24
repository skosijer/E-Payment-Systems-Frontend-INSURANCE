import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng/primeng';
import { SelectItem } from 'primeng/primeng';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import {Osoba, TipNosioca, TipOsobe} from "../../beans/osoba";
import { InsuranceDataService } from "./insurance-data.service";
import { Rizik } from "../../beans/rizik";
import { Nosilac } from "../../beans/nosilac_osiguranja";
import { Message } from 'primeng/primeng';
import { JmbgValidators } from "../../components/validators/jmbg.validators";
import {isNullOrUndefined} from "util";
import {OsiguranjeDTO} from "../../beans/osiguranjeDTO";
import {Osiguranik} from "../../beans/osiguranik";
import {PolisaDTO} from "../../beans/dtos/polisa.dto";
import {TipRizika} from "../../beans/tipRizlika";
import {VoziloDTO} from "../../beans/dtos/vozilo.dto";
import {NekretninaDTO} from "../../beans/dtos/nekretnina.dto";



@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class InsuranceComponent implements OnInit {

  //Podaci za select polja u formama

  items: MenuItem[];
  itemsTwo: MenuItem[];
  destinacije: SelectItem[] = [{ label: 'Odaberite region', value: null }];
  vrstePaketa: SelectItem[];
  starostLabela: SelectItem[] = [];
  starosti: Rizik[] = [];
  regioni: Rizik[] = [];
  osiguranjaDoIznosaRizik:Rizik[]=[];
  paketiOsiguranja: SelectItem[] = [{ label: 'Izaberite paket osiguranja', value: null }];
  slepovanjaDoKm: SelectItem[] = [{ label: 'Izaberite slepovanje [km]', value: null }];
  popravkeDoCene: SelectItem[] = [{ label: 'Izaberite popravku [cena]', value: null }];
  smestajiDoDana: SelectItem[] = [{ label: 'Izaberite smestaj [dana]', value: null }];
  alternativniPrevozi: SelectItem[] = [{ label: 'Izaberite alternativni prevoz', value: null }];
  vrsteAlternativnogPrevoza: SelectItem[];
  osiguranjaStana: SelectItem[] = [{ label: 'Izaberite osiguranje stana', value: null }];
  svrhaOsiguranja: SelectItem[] = [{ label: 'Izaberite svrhu osiguranja', value: null }];
  starostiStana: SelectItem[] = [{ label: 'Izaberite starost stana', value: null }];
  povrsineStana: SelectItem[] = [{ label: 'Izaberite povrsinu stana', value: null }];
  procenjeneVrednostiStana: SelectItem[] = [{ label: 'Izaberite starost stana', value: null }];


  /*DODATI PODACI */
  osiguranjaDoIznosa: SelectItem[] = [{ label: 'Odaberite nadoknadu', value: null }];

  //************************************/

  //Podaci za prikaz tabela koje sadrze sve informacije o dodatnim osiguranjima

  osiguranjaVozila: any[] = [];
  osiguranjaVozilaKolone: any[];

  osiguranjaNekretnina: any[] = [];
  osiguranjaNekretninaKolone: any[];
  putnaOsiguranja: any[] = [];
  putnaOsiguranjaKolone: any[];

  //Forme za kupovinu polise

  form1: FormGroup;
  form1Data: any = { destinacija: "", vrstaPaketa: "individualno", pocetakOsiguranja: new Date, trajanjeOsiguranja: 1, svrhaOsiguranja: null, osiguranDoIznosa: ""};

  form2: FormGroup;
  form2Data: any = { ime: "", jmbg: "", prezime: "", brojPasosa: "", datumRodjenja: null, adresa: "", brojTelefona: "", emailNosioca: "" };
  //form2Data: any = { ime: "Stevan", jmbg: "2409994340053", prezime: "Kosijer", brojPasosa: "123456789", datumRodjenja: null, adresa: "MGorkog 2C", brojTelefona: "184848" };

  form3: FormGroup;
  //form3Data: any = { markaITip: "", godinaProizvodnje: "", brojTablica: "", brojSasije: "", imeVlasnika: '', prezimeVlasnika: '', jmbgVlasnika: '', paketOsiguranja: '', slepovanje: 0, popravka: 0, smestaj: 0, prevoz: 'autobus' };
  form3Data: any = { markaITip: "191919", godinaProizvodnje: "1950", brojTablica: "21442", brojSasije: "421", imeVlasnika: 'Ludak', prezimeVlasnika: 'Ludacina', jmbgVlasnika: '2409994340053', paketOsiguranja: '', slepovanje: 0, popravka: 0, smestaj: 0, prevoz: 'autobus' };

  form4: FormGroup;
  //form4Data: any = { povrsinaStana: "", starostStana: "", procenjenaVrednostStana: "", osiguranjeStana: "", imeVlasnika: '', prezimeVlasnika: '', jmbgVlasnika: '', adresaVlasnika: '' };
  form4Data: any = { povrsinaStana: "525", starostStana: "5252", procenjenaVrednostStana: "1255", osiguranjeStana: "", imeVlasnika: 'Predrag', prezimeVlasnika: 'Preludovic', jmbgVlasnika: '2409994340053', adresaVlasnika: 'Murovac 2' };

  formNosilac: FormGroup;
  formNosilacData: any = { potencijalniNosilac: "", osobe: "", ime: "", jmbg: "", prezime: "", brojPasosa: "", datumRodjenja: null, adresa: "", brojTelefona: "", emailNosioca: "" };
  //**********************************************/


  private showCarDialog = false;
  private showHomeDialog = false;
  private showInsuranceDialog = false;

  //*********************************************/

  private activeIndex = 0;
  private osobe: Osoba[] = [];
  private osobeKolone: any[] = [];


  //Podaci nosioca osiguranja!
  private enterEmailBoolean: boolean = false;
  private canBeInsuranceHolder: boolean = true;


  /*******PODACI ZA NOSIOCA**********/

  private showNosilacDialog: boolean = false;
  potencijalniNosilac: string;
  private osobe_labels: SelectItem[] = [{ label: 'Izaberite nosioca osiguranja', value: null }];
  private nosilac: Nosilac = null;


  /*Poruke za ne validnu prvu formu*/
  msgs: Message[] = [];


  //PODACI ZA BROJ OSIGURANIKA ZA DRUGI KORAK
  private brojOsiguranika: number;
  private ukupnoOsiguranika:number = 0;


  constructor(private fb: FormBuilder, private insuranceDataService: InsuranceDataService) { }

  ngOnInit() {

    this.insuranceDataService.getStarosneGrupe().subscribe(
      (data) => {
        this.starosti = JSON.parse(data['_body']);

        for (let i = 0; i < this.starosti.length; i++) {
          let s = {
            label: this.starosti[i].vrednost, value: this.starosti[i].vrednost
          };
          this.starostLabela.push(s);
          let str = this.starosti[i].vrednost;
          let ss = {
            str: 1
          };
          this.form1Data.str = 1;

          this.form1.addControl(this.starosti[i].vrednost, new FormControl(''));
        }
      }
    );

    this.insuranceDataService.getRegioni().subscribe(
      (data) => {
        this.regioni = JSON.parse(data['_body']);

        for (let i = 0; i < this.regioni.length; i++) {
          let s = {
            label: this.regioni[i].vrednost, value: this.regioni[i].vrednost
          };
          this.destinacije.push(s);
        }
      }
    );

    this.insuranceDataService.getSvrheOsiguranja().subscribe(
      (data) => {
        let rizici: Rizik[] = JSON.parse(data['_body']);
        for (var i = 0; i < rizici.length; i++) {
          let temp: SelectItem = { label: '', value: '' };
          temp.label = rizici[i].vrednost;
          let val: string[] = rizici[i].vrednost.split(" ");
          temp.value = rizici[i].vrednost;
          this.svrhaOsiguranja.push(temp);
        }
      }
    );


    this.insuranceDataService.getOsiguranjaDoIznosa().subscribe(
      (data) => {
        this.osiguranjaDoIznosaRizik = JSON.parse(data['_body']);

        for (let i = 0; i < this.osiguranjaDoIznosaRizik.length; i++) {
          let s = {
            label: this.osiguranjaDoIznosaRizik[i].vrednost, value: this.osiguranjaDoIznosaRizik[i].vrednost
          };
          this.osiguranjaDoIznosa.push(s);
        }
      }
    );

    this.insuranceDataService.getPaketiOsiguranja().subscribe(
      (data) => {
        let rizici: Rizik[] = JSON.parse(data['_body']);
        for (var i = 0; i < rizici.length; i++) {
          let temp: SelectItem = { label: '', value: '' };
          temp.label = rizici[i].vrednost;
          temp.value = rizici[i].vrednost;
          this.paketiOsiguranja.push(temp);
        }
      }
    );

    this.insuranceDataService.getSlepovanje().subscribe(
      (data) => {
        let rizici: Rizik[] = JSON.parse(data['_body']);
        for (var i = 0; i < rizici.length; i++) {
          let temp: SelectItem = { label: '', value: '' };
          temp.label = rizici[i].vrednost;
          temp.value = rizici[i].vrednost;
          this.slepovanjaDoKm.push(temp);
        }
      }
    );

    this.insuranceDataService.getPopravka().subscribe(
      (data) => {
        let rizici: Rizik[] = JSON.parse(data['_body']);
        for (var i = 0; i < rizici.length; i++) {
          let temp: SelectItem = { label: '', value: '' };
          temp.label = rizici[i].vrednost;
          temp.value = rizici[i].vrednost;
          this.popravkeDoCene.push(temp);
        }
      }
    );

    this.insuranceDataService.getPrevoz().subscribe(
      (data) => {
        let rizici: Rizik[] = JSON.parse(data['_body']);
        for (var i = 0; i < rizici.length; i++) {
          let temp: SelectItem = { label: '', value: '' };
          temp.label = rizici[i].vrednost;
          temp.value = rizici[i].vrednost;
          this.alternativniPrevozi.push(temp);
        }
      }
    );

    this.insuranceDataService.getSmestaj().subscribe(
      (data) => {
        let rizici: Rizik[] = JSON.parse(data['_body']);
        for (var i = 0; i < rizici.length; i++) {
          let temp: SelectItem = { label: '', value: '' };
          temp.label = rizici[i].vrednost;
          temp.value = rizici[i].vrednost;
          this.smestajiDoDana.push(temp);
        }
      }
    );

    this.insuranceDataService.getStarostiStana().subscribe(
      (data) => {
        let rizici: Rizik[] = JSON.parse(data['_body']);
        for (var i = 0; i < rizici.length; i++) {
          let temp: SelectItem = { label: '', value: '' };
          temp.label = rizici[i].vrednost;
          let val: string[] = rizici[i].vrednost.split(" ");
          temp.value = rizici[i].vrednost;
          this.starostiStana.push(temp);
        }
      }
    );

    this.insuranceDataService.getProcenjeneVrednostiStana().subscribe(
      (data) => {
        let rizici: Rizik[] = JSON.parse(data['_body']);
        for (var i = 0; i < rizici.length; i++) {
          let temp: SelectItem = { label: '', value: '' };
          temp.label = rizici[i].vrednost;
          let val: string[] = rizici[i].vrednost.split(" ");
          temp.value = rizici[i].vrednost;
          this.procenjeneVrednostiStana.push(temp);
        }
      }
    );

    this.insuranceDataService.getOsiguranjaStana().subscribe(
      (data) => {
        let rizici: Rizik[] = JSON.parse(data['_body']);
        for (var i = 0; i < rizici.length; i++) {
          let temp: SelectItem = { label: '', value: '' };
          temp.label = rizici[i].vrednost;
          let val: string[] = rizici[i].vrednost.split(" ");
          temp.value = rizici[i].vrednost;
          this.osiguranjaStana.push(temp);
        }
      }
    );

    this.insuranceDataService.getPovrsina().subscribe(
      (data) => {
        let rizici: Rizik[] = JSON.parse(data['_body']);
        for (var i = 0; i < rizici.length; i++) {
          let temp: SelectItem = { label: '', value: '' };
          temp.label = rizici[i].vrednost;
          temp.value = rizici[i].vrednost;
          this.povrsineStana.push(temp);
        }
      }
    );


    this.items = [
      { label: 'Osnovni podaci' },
      { label: 'Individualni podaci' },
      { label: 'Ostala osiguranja' },
      { label: 'Placanje' }
    ];

    this.vrstePaketa = [
      { label: 'Individualno', value: "individualno" },
      { label: 'Grupno', value: "grupno" }
    ];


    this.vrsteAlternativnogPrevoza = [
      { label: 'Autobus', value: "autobus" },
      { label: 'Automobil', value: "automobil" },
      { label: 'Avion', value: "avion" }
    ];

    this.osiguranjaVozilaKolone = [
      { field: 'markaITip', header: 'Marka i tip vozila' },
      //{field: 'godinaProizvodnje', header: 'Godina proizvodnje'}, //Potrebno je formatirati ovaj datum na neki nacin
      { field: 'brojTablica', header: 'Broj tablica' },
      { field: 'brojSasije', header: 'Broj šasije' },
      { field: 'paketOsiguranja', header: 'Paket osiguranja' },
      //{ field: 'slepovanje', header: 'Šlepovanje (KM)' },
      //{ field: 'popravka', header: 'Popravka (RSD)' },
      //{ field: 'smestaj', header: 'Smeštaj (dana)' },
      { field: 'prevoz', header: 'Prevoz' }
    ];

    this.osiguranjaNekretninaKolone = [
      { field: 'povrsinaStana', header: 'Površina stana' },
      { field: 'starostStana', header: 'Starost stana (godine)' },
      { field: 'procenjenaVrednostStana', header: 'Procenjena vrednost stana (RSD)' },
      { field: 'osiguranjeStana', header: 'Od čega se osigurava' },
      { field: 'imeVlasnika', header: 'Ime vlasnika' },
      { field: 'prezimeVlasnika', header: 'Adresa vlasnika' },
      { field: 'jmbgVlasnika', header: 'JMBG vlasnika' },
      { field: 'adresaVlasnika', header: 'Adresa vlasnika' }
    ];

    this.putnaOsiguranjaKolone = [
      { field: 'ime', header: 'Ime' },
      { field: 'jmbg', header: 'JMBG' },
      { field: 'prezime', header: 'Prezime' }
    ];
    this.osobeKolone = [
      { field: 'ime', header: 'Ime' },
      { field: 'jmbg', header: 'JMBG' },
      { field: 'prezime', header: 'Prezime' }
    ];


    this.form1 = this.fb.group({
      destinacija: ['', Validators.required],
      vrstaPaketa: ['', Validators.required],
      //polje vezano samo za individualno osiguranje
      starost: [''],
      pocetakOsiguranja: ['', Validators.required],
      trajanjeOsiguranja: ['', Validators.required],
      svrhaOsiguranja: [''],
      osiguranDoIznosa: ['']
    });

    this.form2 = this.fb.group({
      ime: ['', Validators.required],
      prezime: ['', Validators.required],
      jmbg: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(13), JmbgValidators.proveraContrBr]],
      brojPasosa: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      datumRodjenja: [''],
      adresa: ['', Validators.required],
      brojTelefona: [''],
      emailNosioca: ['']
    });

    this.form3 = this.fb.group({
      markaITip: ['', Validators.required],
      godinaProizvodnje: ['', [Validators.pattern('[01-9]{4}'), Validators.required]],
      brojTablica: ['', Validators.required],
      brojSasije: ['', Validators.required],
      imeVlasnika: ['', Validators.required],
      prezimeVlasnika: ['', Validators.required],
      jmbgVlasnika: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(13), JmbgValidators.proveraContrBr]],
      paketOsiguranja: ['', Validators.required],
      slepovanje: [''],
      popravka: [''],
      smestaj: [''],
      prevoz: ['']
    });

    this.form4 = this.fb.group({
      povrsinaStana: ['', Validators.required],
      starostStana: ['', Validators.required],
      procenjenaVrednostStana: ['', Validators.required],
      osiguranjeStana: ['', Validators.required],
      imeVlasnika: ['', Validators.required],
      prezimeVlasnika: ['', Validators.required],
      jmbgVlasnika: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(13), JmbgValidators.proveraContrBr]],
      adresaVlasnika: ['', Validators.required]
    });

    console.log('FORM 2');
    console.log(this.form2);

    this.formNosilac = this.fb.group({
      potencijalniNosilac: [''],
      osobe: [''],
      ime: ['', Validators.required],
      prezime: ['', Validators.required],
      jmbg: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(13), JmbgValidators.proveraContrBr]],
      brojPasosa: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      datumRodjenja: [''],
      adresa: ['', Validators.required],
      brojTelefona: [''],
      emailNosioca: ['', [Validators.required, Validators.email]]
    });
  }

  stepSubmit() {
    console.log(this.form1);
    this.msgs = [];
    if(this.form1.controls['vrstaPaketa'].value == 'grupno') {
      this.brojOsiguranika = 0;
      for(let i = 0; i < this.starosti.length; i++) {
        console.log(this.form1.controls[this.starosti[i].vrednost].value);
        if(this.form1.controls[this.starosti[i].vrednost].value != "") {
          this.brojOsiguranika += this.form1.controls[this.starosti[i].vrednost].value;
          this.form1Data[this.starosti[i].vrednost] = this.form1.controls[this.starosti[i].vrednost].value;
        } else {
          this.form1Data[this.starosti[i].vrednost] = 0;
        }
      }
      console.log(this.brojOsiguranika);
      this.ukupnoOsiguranika = this.brojOsiguranika;
      if(this.brojOsiguranika < 2) {
        this.msgs.push({severity:'info', summary:'Postovani,', detail:'Molim Vas unesite broj osoba veci od 1!'});
        return;
      }

      if(this.osobe.length > 0){
        this.brojOsiguranika = this.brojOsiguranika - this.osobe.length;
      }

    } else {
      this.brojOsiguranika = 1;
      this.ukupnoOsiguranika = 1;
        if(this.form1.controls['starost'].value == null) {
          this.msgs.push({severity:'info', summary:'Postovani,', detail:'Molim Vas odaberite uzrast lica koje putuje!'});
          return;
        }
    }

    if(this.form1.controls['svrhaOsiguranja'].value == null){
      this.msgs.push({severity:'info', summary:'Postovani,', detail:'Molim Vas odaberite svrhu osiguranja!'});
      return;
    }

    console.log(this.form1Data);
    console.log(this.starosti);

    this.activeIndex++;

    if (this.activeIndex != 1)
      return;
  }

  vrstaPaketaChange(){
    this.osobe = [];
  }

  secondStepSubmit() {

    this.msgs = [];

    if(this.osobe.length < this.ukupnoOsiguranika){
      this.msgs.push({severity:'info', summary:'Postovani,', detail:'Molim Vas unesite osiguranike!'});
      return;
    }

    if(this.osobe.length == this.ukupnoOsiguranika && this.nosilac != null){
      this.activeIndex++;
      return;
    }

    let counter: number = 0;
    for (let i = 0; i < this.osobe.length; i++) {
      console.log(this.osobe[i].email);
      if (this.osobe[i].email !== undefined) {
        counter++;
        break;
      }
    }

    if (counter > 0) {
      this.activeIndex++;

      if (this.activeIndex != 2)
        return;
    } else {
      this.osobe_labels = [{
        label: 'Izaberite nosioca osiguranja', value: null
      }];
      this.showNosilacDialog = true;
      for (let i = 0; i < this.osobe.length; i++) {

        let temp: SelectItem = { label: '', value: '' };
        temp.label = this.osobe[i].ime + ' ' + this.osobe[i].prezime + ' |JMBG:' + this.osobe[i].jmbg;
        temp.value = this.osobe[i].jmbg;
        this.osobe_labels.push(temp);
      }
    }
  }

  valueOfEachAgeGroup(grupa) {
    if (!isNullOrUndefined(this.form1Data[grupa]))
      return this.form1Data[grupa];
    return 0;
  }


  previous() {
    if(this.activeIndex == 1 && this.form1.controls['vrstaPaketa'].value == 'grupno') {
      for(let i = 0; i < this.starosti.length; i++) {
        this.form1.controls[this.starosti[i].vrednost].setValue(this.form1Data[this.starosti[i].vrednost]);
      }
    }
    this.activeIndex--;
  }

  dodajOsiguranjeVozila() {
    console.log(this.form3);
    //pravljenje kopije objekta da se ne bi prenosila referenca u novi niz
    let x = Object.assign({}, this.form3Data);
    //spread operator za unos kopije objekta u niz
    this.osiguranjaVozila = [...this.osiguranjaVozila, x];
    this.showCarDialog = false;
    this.form3.reset();
  }

  obrisiOsiguranjeVozila(formaOsiguranjaVozila) {
    let index = this.osiguranjaVozila.indexOf(formaOsiguranjaVozila);
    this.osiguranjaVozila.splice(index, 1);
    this.osiguranjaVozila = [...this.osiguranjaVozila];
  }

  dodajOsiguranjeNekretnine() {
    //pravljenje kopije objekta da se ne bi prenosila referenca u novi niz
    let x = Object.assign({}, this.form4Data);
    //spread operator za unos kopije objekta u niz
    this.osiguranjaNekretnina = [...this.osiguranjaNekretnina, x];
    this.showHomeDialog = false;
    this.form4.reset();
  }

  obrisiOsiguranjeNekretnine(formaOsiguranjaNekretnine) {
    let index = this.osiguranjaNekretnina.indexOf(formaOsiguranjaNekretnine);
    this.osiguranjaNekretnina.splice(index, 1);
    this.osiguranjaNekretnina = [...this.osiguranjaNekretnina];
  }

  dodajOsiguranika() {

    //pravljenje kopije objekta da se ne bi prenosila referenca u novi niz

    let x = Object.assign({}, this.form2Data);
    //spread operator za unos kopije objekta u niz

    this.showInsuranceDialog = false;

    let osoba: Osoba = new Osoba();
    osoba.ime = x.ime;
    osoba.adresa = x.adresa;
    osoba.brojPasosa = x.brojPasosa;
    osoba.jmbg = x.jmbg;
    osoba.brojTelefona = x.brojTelefona;
    osoba.datumRodjenja = x.datumRodjenja;
    osoba.prezime = x.prezime;

    //Provera da li je dodati osiguranik nosilac osiguranja
    if (x.emailNosioca != '') {
      this.canBeInsuranceHolder = false;
      osoba.email = x.emailNosioca;
      this.osobe = [...this.osobe, osoba];
      this.nosilac = new Nosilac(osoba, TipNosioca.OSIGURANIK);
    } else {
      this.osobe = [...this.osobe, osoba];
    }

    this.brojOsiguranika--;
    this.form2.reset();
  }

  obrisiOsiguranika(osiguranik) {

    let osoba: Osoba = new Osoba();
    for (var i = 0; i < this.osobe.length; i++) {
      if (this.osobe[i].jmbg == osiguranik.jmbg) {
        osoba = this.osobe[i];
        break;
      }
    }

    let index = this.osobe.indexOf(osoba);

    if (this.nosilac) {
      if (this.nosilac.osoba.jmbg === osoba.jmbg) {
        this.nosilac = null;
      }
    }

    this.osobe.splice(index, 1);
    this.osobe = [...this.osobe];
    this.brojOsiguranika++;


    if (osiguranik.emailNosioca != '') {
      this.canBeInsuranceHolder = true;
      this.enterEmailBoolean = false;
    }
  }

  thirdStepSubmit(){

    console.log(this.osiguranjaVozila);
    console.log(this.osiguranjaNekretnina);
    this.activeIndex++;
  }

  onShowCarDialog() {
    this.showCarDialog = true;
  }

  onShowHomeDialog() {
    this.showHomeDialog = true;
  }

  onShowInsuranceDialog() {
    this.form2.controls['emailNosioca'].setValue('');
    this.form2Data.emailNosioca = '';
    this.form2.controls['emailNosioca'].setErrors(null);
    this.showInsuranceDialog = true;
  }

  nosiocOsiguranjaChange(checked: boolean) {

    this.enterEmailBoolean = checked;
    if(this.enterEmailBoolean == false){
      this.form2.controls['emailNosioca'].setValue('');
      this.form2Data.emailNosioca = '';
      this.form2.controls['emailNosioca'].setErrors(null);
    }
  }

  dodajNosioca() {
    let x = Object.assign({}, this.formNosilacData);
    if (this.potencijalniNosilac === 'osiguranik') {
      if (x.osobe != '') {
        for (var i = 0; i < this.osobe.length; i++) {
          if (x.osobe === this.osobe[i].jmbg) {

            this.osobe[i].email = x.emailNosioca;
            this.nosilac = new Nosilac(this.osobe[i], TipNosioca.OSIGURANIK);
            this.canBeInsuranceHolder = false;
            break;
          }
        }
      }
    } else {

      let osoba: Osoba = new Osoba();
      osoba.ime = x.ime;
      osoba.adresa = x.adresa;
      osoba.brojPasosa = x.brojPasosa;
      osoba.jmbg = x.jmbg;
      osoba.brojTelefona = x.brojTelefona;
      osoba.datumRodjenja = x.datumRodjenja;
      osoba.prezime = x.prezime;
      osoba.email = x.emailNosioca;
      this.nosilac = new Nosilac(osoba, TipNosioca.DRUGO_LICE);
      this.canBeInsuranceHolder = false;
    }
    this.showNosilacDialog = false;
    this.activeIndex++;

    if (this.activeIndex != 2)
      return;
  }


  isFieldValidForm2(field: string) {
    return (!this.form2.controls[field].valid && this.form2.controls[field].touched);
  }

  isFieldValidForm3(field: string) {
    return (!this.form3.controls[field].valid && this.form3.controls[field].touched);
  }

  isFieldValidForm4(field: string) {
    return (!this.form4.controls[field].valid && this.form4.controls[field].touched);
  }


  isFieldValidFormNosilac(field: string) {
    return (!this.formNosilac.controls[field].valid && this.formNosilac.controls[field].touched);
  }

  step4Back(){
    this.activeIndex--;
  }

  buy() {

    let polisa = new PolisaDTO();
    polisa.osiguranici = this.osobe;
    polisa.nosilac = this.nosilac.osoba;
    if(this.nosilac.tip == TipNosioca.OSIGURANIK){
      polisa.nosilac.tipOsobe = TipOsobe.OSIGURANIK;
    }else{
      polisa.nosilac.tipOsobe = TipOsobe.DRUGO_LICE;
    }

    let riziciPutno:Rizik[]=[];

    riziciPutno[0] = new Rizik();
    riziciPutno[0].vrednost = this.form1Data.destinacija;
    riziciPutno[1] = new Rizik();
    riziciPutno[1].vrednost = this.form1Data.osiguranDoIznosa;
    let temp:number = 2;
    if(this.form1Data.vrstaPaketa == "individualno"){
      riziciPutno[temp] = new Rizik();
      riziciPutno[temp].vrednost = this.form1Data.starost;
      riziciPutno[temp].kolicina = 1;
      temp++;
    }else{
      for(var i = 0; i < this.starosti.length; i++){
        let tipRizikaString:string = this.starosti[i].vrednost;
        let broj:number = this.form1Data[tipRizikaString];
        if(broj > 0){
          riziciPutno[temp] = new Rizik();
          riziciPutno[temp].vrednost = tipRizikaString;
          riziciPutno[temp].kolicina = broj;
          temp++;
        }
      }
    }

    riziciPutno[temp] = new Rizik();
    riziciPutno[temp].vrednost = this.form1Data.svrhaOsiguranja;
    temp++;

    polisa.riziciPutno = riziciPutno;
    polisa.vrstaPaketa = this.form1Data.vrstaPaketa;
    polisa.trajanjeOsiguranja = this.form1Data.trajanjeOsiguranja;
    polisa.pocetakOsiguranja = this.form1Data.pocetakOsiguranja;

    let vozila:VoziloDTO[] = [];

    for(var i = 0; i < this.osiguranjaVozila.length; i++){
      vozila[i] = new VoziloDTO();
      vozila[i].vlasnik.ime = this.osiguranjaVozila[i].imeVlasnika;
      vozila[i].vlasnik.prezime = this.osiguranjaVozila[i].prezimeVlasnika;
      vozila[i].vlasnik.jmbg = this.osiguranjaVozila[i].jmbgVlasnika;

      vozila[i].brojSasije = this.osiguranjaVozila[i].brojSasije;
      vozila[i].brojTablica = this.osiguranjaVozila[i].brojTablica;
      vozila[i].godinaProizvodnje = this.osiguranjaVozila[i].godinaProizvodnje;
      vozila[i].markaTip = this.osiguranjaVozila[i].markaITip;

      vozila[i].rizici[0] = new Rizik();
      vozila[i].rizici[0].vrednost = this.osiguranjaVozila[i].paketOsiguranja;

      vozila[i].rizici[1] = new Rizik();
      vozila[i].rizici[1].vrednost = this.osiguranjaVozila[i].slepovanje;

      vozila[i].rizici[2] = new Rizik();
      vozila[i].rizici[2].vrednost = this.osiguranjaVozila[i].popravka;

      vozila[i].rizici[3] = new Rizik();
      vozila[i].rizici[3].vrednost = this.osiguranjaVozila[i].smestaj;

      vozila[i].rizici[4] = new Rizik();
      vozila[i].rizici[4].vrednost = this.osiguranjaVozila[i].prevoz;
    }

    polisa.vozila = vozila;
    let nekretnine:NekretninaDTO[]=[];

    for(var i = 0; i < this.osiguranjaNekretnina.length; i++){
      nekretnine[i] = new NekretninaDTO();
      nekretnine[i].vlasnik.ime = this.osiguranjaNekretnina[i].imeVlasnika;
      nekretnine[i].vlasnik.adresa = this.osiguranjaNekretnina[i].adresaVlasnika;
      nekretnine[i].vlasnik.jmbg = this.osiguranjaNekretnina[i].jmbgVlasnika;
      nekretnine[i].vlasnik.prezime = this.osiguranjaNekretnina[i].prezimeVlasnika;

      nekretnine[i].rizici[0] = new Rizik();
      nekretnine[i].rizici[0].vrednost = this.osiguranjaNekretnina[i].povrsinaStana;

      nekretnine[i].rizici[1] = new Rizik();
      nekretnine[i].rizici[1].vrednost = this.osiguranjaNekretnina[i].starostStana;

      nekretnine[i].rizici[2] = new Rizik();
      nekretnine[i].rizici[2].vrednost = this.osiguranjaNekretnina[i].osiguranjeStana;

      nekretnine[i].rizici[3] = new Rizik();
      nekretnine[i].rizici[3].vrednost = this.osiguranjaNekretnina[i].procenjenaVrednostStana;
    }

    polisa.nekretnine = nekretnine;

    console.log(polisa);
  }


}
