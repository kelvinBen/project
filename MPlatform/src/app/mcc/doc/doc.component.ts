import { Component, OnInit, AfterViewChecked, OnDestroy,ElementRef } from '@angular/core';
import { Route, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
declare var $: any;
declare var editormd: any;
@Component({
  selector: 'app-doc',
  templateUrl: './doc.component.html',
  styleUrls: ['./doc.component.css']
})
export class DocComponent implements OnInit, AfterViewChecked, OnDestroy {
  private fragment: string;
  fragSub: Subscription;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.fragSub = this.route.fragment.subscribe(fragment => {
    this.fragment = fragment;
    });
    var testEditormdView, testEditormdView2;

    $.get("../../../assets/docs/doc.md", function (markdown) {

      testEditormdView = editormd.markdownToHTML("test-editormd-view", {
        markdown: markdown,//+ "\r\n" + $("#append-test").text(),
        //htmlDecode      : true,       // 开启 HTML 标签解析，为了安全性，默认不开启
        htmlDecode: "style,script,iframe",  // you can filter tags decode
        //toc             : false,
        tocm: true,    // Using [TOCM]
        tocContainer: "#custom-toc-container", // 自定义 ToC 容器层
        //gfm             : false,
        // tocDropdown     : true,
        // markdownSourceCode : true, // 是否保留 Markdown 源码，即是否删除保存源码的 Textarea 标签
        emoji: true,
        taskList: true,
        tex: true,  // 默认不解析
        flowChart: true,  // 默认不解析
        sequenceDiagram: true,  // 默认不解析
      });
    });
   
  }

  ngAfterViewChecked(): void {
    $("#custom-toc-container  a").each((ele) => {
      var dom= $("#custom-toc-container  a")[ele];
      console.log($(dom))
    $(dom).attr("href",'http://localhost:4200/#/mcc/doc#'+$(dom).text());
    });
   
    try {
      document.getElementsByName(this.fragment)[0].scrollIntoView();
    } catch (e) { }
  }
  ngOnDestroy() {
    this.fragSub.unsubscribe();
   
  }

}
