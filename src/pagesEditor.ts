import * as ko from "knockout";
import { SurveyHelper, ObjType } from "./surveyHelper";
import { SurveyObjectItem } from "./surveyObjects";
import * as Survey from "survey-knockout";
import { editorLocalization } from "./editorLocalization";
import { SurveyPropertyEditorShowWindow } from "./questionEditors/questionEditor";
import { SurveyForDesigner, SurveyEditor } from "./entries";
import "knockout-sortablejs";

export class PagesEditor {
  constructor(
    private pages: KnockoutObservableArray<Survey.PageModel>,
    private globalSelectedObject: KnockoutObservable<SurveyObjectItem>,
    private selectPage: Function,
    private showPageSettings: Function,
    private addPage: Function,
    private copyPage: Function,
    private deletePage: Function,
    private movePage: Function,
    private element: any
  ) {}

  get sortableOptions() {
    return {
      onEnd: evt => {
        this.movePage(evt.oldIndex, evt.newIndex);
      },
      handle: ".svd-page-name",
      animation: 150
    };
  }

  get selectedPage() {
    return this.isActive()
      ? this.globalSelectedObject().value
      : this.pages()[0];
  }
  set selectedPage(newPage) {
    this.selectPage(newPage);
  }
  getPageClass = page => {
    return page === this.selectedPage ? "svd_selected_page" : "";
  };
  getPageMenuClass = page => {
    return page !== this.selectedPage || !this.isActive()
      ? "menu-disabled"
      : null;
  };
  getPageMenuIconClass = page => {
    return page === this.selectedPage && this.isActive()
      ? "icon-gear-active"
      : "icon-gear";
  };
  isLastPage() {
    return this.pages().length === 1;
  }
  moveLeft(model, event) {
    var pagesElement = this.element.querySelector(".svd-pages");
    pagesElement.scrollLeft -= 50;
  }
  moveRight(model, event) {
    var pagesElement = this.element.querySelector(".svd-pages");
    pagesElement.scrollLeft += 50;
  }
  // moveToSelectedPage() {
  //   var pagesElement: any = this.element.querySelector(".svd-pages");
  //   var index = this.pages().indexOf(this.selectedPage());
  //   var pageElement = pagesElement.children[index];
  //   if (!pageElement) return;
  //   pagesElement.scrollTo(
  //     pageElement.offsetLeft - pagesElement.offsetWidth / 2,
  //     0
  //   );
  // }
  // onKeyDown(el: any, e: KeyboardEvent) {
  //   if (this.koPages().length <= 1) return;
  //   var pages = this.koPages();
  //   var pageIndex = -1;
  //   for (var i = 0; i < pages.length; i++) {
  //     if (pages[i].page && pages[i].koSelected()) {
  //       pageIndex = i;
  //     }
  //   }
  //   if (pageIndex < 0) return;
  //   if (e.keyCode == 46 && this.onDeletePageCallback)
  //     this.onDeletePageCallback(el.page);
  //   if ((e.keyCode == 37 || e.keyCode == 39) && this.onSelectPageCallback) {
  //     pageIndex += e.keyCode == 37 ? -1 : 1;
  //     if (pageIndex < 0) pageIndex = pages.length - 1;
  //     if (pageIndex >= pages.length) pageIndex = 0;
  //     var page = pages[pageIndex].page;
  //     this.onSelectPageCallback(page);
  //     this.setSelectedPage(page);
  //   }
  // }

  onWheel(model, event) {
    var pagesElement = model.element.querySelector(".svd-pages");
    event = event || window.event;
    var delta = event.deltaY || event.detail || event.wheelDelta;
    pagesElement.scrollLeft -= delta;
    event.preventDefault ? event.preventDefault() : (event.returnValue = false);
  }
  getLocString(str: string) {
    return editorLocalization.getString(str);
  }
  isActive() {
    return (
      SurveyHelper.getObjectType(this.globalSelectedObject().value) ===
      ObjType.Page
    );
  }
}

ko.components.register("pages-editor", {
  viewModel: {
    createViewModel: (params, componentInfo) => {
      return new PagesEditor(
        params.pages,
        params.globalSelectedObject,
        params.selectPage,
        params.showPageSettings,
        params.addPage,
        params.copyPage,
        params.deletePage,
        params.movePage,
        componentInfo.element
      );
    }
  },
  template: { element: "svd-page-selector-template" }
});
