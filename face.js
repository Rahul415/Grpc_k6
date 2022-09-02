import grpc from 'k6/net/grpc';
import { check, sleep } from 'k6';
import encoding from 'k6/encoding';

const client = new grpc.Client();
client.load(['./'], 'face.proto');

let image5 = open('images/image-1.png', 'b');
let image6 = open('images/image-1.png', 'b');



export default () => {
  client.connect('35.200.139.232:80', {
    plaintext: true
  });

  const im1= encoding.b64encode(image5,'std','s')
  const im2= encoding.b64encode(image6,'std','s')
 
  const data = {
    Image2:   im1,
    Image:    im2,
    XCallID:'somestring',
    type : '0',
    preprocess_type : '2'
  }
  
  const response = client.invoke('platform.FaceMatch/faceMatch', data);

  check(response, {
    'status is OK': (r) => r && r.status === grpc.StatusOK,
  });

  console.log(JSON.stringify(response.message));
  console.log(JSON.stringify(response.message.resultJsonB));


  client.close();
  sleep(1);
    
};

export const options ={
  duration: '5m',
  // vus: 5,
}
