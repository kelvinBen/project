import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ServiceService } from '../../../service/service.service';
import { HospitalOper } from '../../../model/hospital';
import { CommunicationOper } from '../../../model/communication';
import { TransportOper } from '../../../model/transport';
import { ShelterOper } from '../../../model/shelter';

@Component({
  selector: 'app-outoper',
  templateUrl: './outoper.component.html',
  styleUrls: ['./outoper.component.css']
})
export class OutoperComponent implements OnInit {

  constructor(private serviceService: ServiceService, private route: ActivatedRoute, private router: Router) { }
  pId: number = undefined;
  pType: number = 1;
  vm: HospitalOper = new HospitalOper();
  commu: CommunicationOper = new CommunicationOper();
  trans: TransportOper = new TransportOper();
  s: ShelterOper = new ShelterOper();
  type1: number = undefined;
  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.pId = params['id'] as number;
      this.pType = params['type'] as number;
      this.type1 = params['view'] as number;
      console.log(1);
      if (this.pType == 1) {
        if (this.pId) {
          this.serviceService.Get('hospital', '?id=eq.' + this.pId).subscribe(result => {
            this.vm = (result as HospitalOper[])[0];
          }, error => {
            console.log(error);
          });
        }
      } else if (this.pType == 2) {
        if (this.pId) {
          this.serviceService.Get('communication', '?id=eq.' + this.pId).subscribe(result => {
            this.commu = (result as CommunicationOper[])[0];
          }, error => {
            console.log(error);
          })
        }
      } else if (this.pType == 3) {
        if (this.pId) {
          this.serviceService.Get('transport', '?id=eq.' + this.pId).subscribe(result => {
            this.trans = (result as TransportOper[])[0];
          }, error => {
            console.log(error);
          })
        }
      } else if (this.pType == 4) {
        if (this.pId) {
          this.serviceService.Get('shelter', '?id=eq.' + this.pId).subscribe(result => {
            this.s = (result as ShelterOper[])[0];
          }, error => {
            console.log(error);
          })
        }
      }
    });
  }
  onHSubmit() {
    if (this.pId) {//edit
      this.serviceService.Patch('hospital', '?id=eq.' + this.pId, this.vm).subscribe(result => {
        this.router.navigate(['resource/out'])
      }, error => {
        console.log(error);
      })
    } else {//add
      this.serviceService.Post('hospital', this.vm).subscribe(result => {
        this.router.navigate(['resource/out'])
      }, error => {
        console.log(error);
      });
    }
  }

  onCSubmit() {
    if (this.pId) {//edit
      this.serviceService.Patch('communication', '?id=eq.' + this.pId, this.commu).subscribe(result => {
        this.router.navigate(['resource/out/1'])
      }, error => {
        console.log(error);
      })
    } else {//add
      this.serviceService.Post('communication', this.commu).subscribe(result => {
        this.router.navigate(['resource/out/1'])
      }, error => {
        console.log(error);
      });
    }
  }

  onTSubmit() {
    if (this.pId) {//edit
      this.serviceService.Patch('transport', '?id=eq.' + this.pId, this.trans).subscribe(result => {
        this.router.navigate(['resource/out/2'])
      }, error => {
        console.log(error);
      })
    } else {//add
      this.serviceService.Post('transport', this.trans).subscribe(result => {
        this.router.navigate(['resource/out/2'])
      }, error => {
        console.log(error);
      });
    }
  }

  onSSubmit() {
    if (this.pId) {//edit
      this.serviceService.Patch('shelter', '?id=eq.' + this.pId, this.s).subscribe(result => {
        this.router.navigate(['resource/out/3'])
      }, error => {
        console.log(error);
      })
    } else {//add
      this.serviceService.Post('shelter', this.s).subscribe(result => {
        this.router.navigate(['resource/out/3'])
      }, error => {
        console.log(error);
      });
    }
  }
}
