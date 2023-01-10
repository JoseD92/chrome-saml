import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'action-value',
  styleUrls: ['./value.component.scss'],
  templateUrl: './value.component.html',
})
export class ValueComponent {
  constructor(private readonly snackBar: MatSnackBar) {}

  @Input() value;

  copy() {
    navigator.clipboard.writeText(this.value);
    this.snackBar.open('Copied to clipboard', undefined, { duration: 1000 });
  }
  download() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    chrome.tabs.query(queryOptions, ([tab]) => {
      let downloadId;

      function onChanged(delta: chrome.downloads.DownloadDelta) {
        if (delta.id === downloadId && delta.state && delta.state.current !== 'in_progress') {
          chrome.downloads.onChanged.removeListener(onChanged);
          chrome.tabs.remove(tab.id);
        }
      };
      chrome.downloads.onChanged.addListener(onChanged);

      let jsonBlob = new Blob( [this.value], { type : "application/json" });
      let objectURL = window.URL.createObjectURL(jsonBlob);
      chrome.downloads.download({ url: objectURL, filename: "saml.txt", saveAs: null }, (id) => {
        downloadId = id;
      });
    });
  }
}
