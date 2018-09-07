import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-config-set',
  templateUrl: './config-set.component.html',
  styleUrls: ['./config-set.component.css']
})
export class ConfigSetComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConfigSetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

}
