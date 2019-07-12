import {Observable, of} from 'rxjs';
import {AggregateText, Seed} from '../../../shared/models';



export const mockResponse: AggregateText[] = [
  {

    characterCount: 1958,
    contentType: 'text/html; charset=utf-8',
    discoveryPath: 'L',
    endTime: 1548496033,
    executionId: '1a7b113c-76d2-428e-8aaf-8e5d71a5bfd7',
    jobExecutionId: '019c1ccb-76a7-4b0a-8baf-160a22feba28',
    language: 'NOB',
    lix: 58,
    longWordCount: 126,
    recordType: 'response',
    requestedUri: 'https://aho.no/no/nyhetsarkiv/aho-masterprogram-karet-til-et-av-de-beste-i-verden',
    seedId: '02e38834-f418-46a3-a7b6-cf94f4d8eac2',
    sentenceCount: 15,
    size: 34926,
    startTime: 1548482401,
    timeStamp: 'Sat Jan 26 2019 06:33:54 GMT+00:00',
    warcId: '00032cc6-d170-4fc5-8b25-1d52662008d0',
    wordCount: 358

  },
  {

    characterCount: 739,
    contentType: 'text/html; charset=utf-8',
    discoveryPath: 'LL',
    endTime: 'Thu Nov 08 2018 10:19:52 GMT+00:00',
    executionId: 'e3a13d10-08ae-4b26-a6d9-480d6748ff3f',
    jobExecutionId: '82a24b6e-a228-4cc5-85e0-021b1fd82393',
    language: 'DAN',
    lix: 28,
    longWordCount: 34,
    recordType: 'response',
    requestedUri: 'https://aho.no/no/news/video-m%C3%B8t-ahos-studenter-og-l%C3%A6rere',
    seedId: '02e38834-f418-46a3-a7b6-cf94f4d8eac2',
    sentenceCount: 18,
    size: 31530,
    startTime: 'Thu Nov 08 2018 06:00:01 GMT+00:00',
    timeStamp: 'Thu Nov 08 2018 08:12:26 GMT+00:00',
    warcId: '00227ca2-8074-4ca2-bf71-8e19e97c89a0',
    wordCount: 173

  },
  {

    characterCount: 3237,
    contentType: 'text/html; charset=utf-8',
    discoveryPath: 'LL',
    endTime: 'Sat Dec 22 2018 11:24:30 GMT+00:00',
    executionId: '9ab8bd78-1ddd-49dd-b77d-cceaba096114',
    jobExecutionId: '72b1d9b4-70e9-4d16-8278-601acba1f5a8',
    language: 'NOB',
    lix: 54,
    longWordCount: 210,
    recordType: 'response',
    requestedUri: 'https://aho.no/no/studier/landskapsarkitektur/383-ul',
    seedId: '02e38834-f418-46a3-a7b6-cf94f4d8eac2',
    sentenceCount: 35,
    size: 25132,
    startTime: 'Sat Dec 22 2018 06:00:01 GMT+00:00',
    timeStamp: 'Sat Dec 22 2018 08:40:31 GMT+00:00',
    warcId: '000e2fdc-7b24-4181-a8de-91eb3648057e',
    wordCount: 516

  },
  {

    characterCount: 1090,
    collectionFinalName: 'nna',
    contentType: 'text/html; charset=utf-8',
    discoveryPath: 'LL',
    endTime: 'Fri Feb 01 2019 09:17:44 GMT+00:00',
    executionId: '1bf431f7-c724-4154-9c9e-551df7013112',
    jobExecutionId: '7cef9888-776a-46f2-bc7b-6254c85cf7b6',
    language: 'NOB',
    lix: 53,
    longWordCount: 69,
    recordType: 'response',
    requestedUri: 'https://aho.no/no/bibliotek/forskningsrapportering-cristin',
    seedId: '02e38834-f418-46a3-a7b6-cf94f4d8eac2',
    sentenceCount: 14,
    size: 25859,
    startTime: 'Fri Feb 01 2019 06:00:02 GMT+00:00',
    timeStamp: 'Fri Feb 01 2019 07:38:01 GMT+00:00',
    warcId: '00026ebe-de6e-470a-9537-60d99cfc8e74',
    wordCount: 162

  },
  {

    characterCount: 701,
    contentType: 'text/html; charset=utf-8',
    discoveryPath: 'LR',
    endTime: 'Sat Nov 10 2018 12:01:08 GMT+00:00',
    executionId: 'd5e0104a-1f1f-4e6a-8509-6a8a549357c3',
    jobExecutionId: '2f33177d-0f18-4e0d-be49-05f57c6b78ae',
    language: 'ENG',
    lix: 34,
    longWordCount: 42,
    recordType: 'response',
    referrer: 'https://web.aho.no/en/news',
    requestedUri: 'https://aho.no//en/news',
    seedId: '02e38834-f418-46a3-a7b6-cf94f4d8eac2',
    sentenceCount: 22,
    size: 22840,
    startTime: 'Sat Nov 10 2018 06:00:03 GMT+00:00',
    timeStamp: 'Sat Nov 10 2018 06:49:08 GMT+00:00',
    warcId: '00025e79-7d32-461e-96cb-5de9995aa383',
    wordCount: 150

  }];

export class MaalfridStub {
  getExecutions(seed?: Seed): Observable<AggregateText[]> {
    return of(mockResponse);
  }
}
