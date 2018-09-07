// import { Injectable }       from '@angular/core';

// import { SelectItem } from '../form-type/item-select';
// import { InputBase }     from '../model/input-base';
// import { VarcharItem }  from '../form-type/item-varchar';

// @Injectable()
// export class QuestionService {

//   // TODO: get from a remote source of question metadata
//   // TODO: make asynchronous
//   getQuestions() {

//     let questions: InputBase<any>[] = [

//       new SelectItem({
//         key: 'brave',
//         label: 'Bravery Rating',
//         options: [
//           {key: 'solid',  value: 'Solid'},
//           {key: 'great',  value: 'Great'},
//           {key: 'good',   value: 'Good'},
//           {key: 'unproven', value: 'Unproven'}
//         ],
//         order: 3
//       }),

//       new VarcharItem({
//         key: 'firstName',
//         label: 'First name',
//         value: 'Bombasto',
//         required: true,
//         order: 1
//       }),

//       new VarcharItem({
//         key: 'emailAddress',
//         label: 'Email',
//         type: 'email',
//         order: 2
//       })
//     ];

//     return questions.sort((a, b) => a.order - b.order);
//   }
// }


// /*
// Copyright 2017-2018 Google Inc. All Rights Reserved.
// Use of this source code is governed by an MIT-style license that
// can be found in the LICENSE file at http://angular.io/license
// */