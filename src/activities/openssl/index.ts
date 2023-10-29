/** @format */

import {Activity} from '../../apps/runner/startup/Activities';
import {State} from '../../apps/runner/lib/state';
import {Actions} from '../../apps/runner/lib/types';

export const opensslActions: Actions = {
  gen_ca_private_key: [
    'list',
    ['print', '* Generate CA private key'],
    [
      'shell-command',
      'openssl genrsa -aes256 -out "${dir}/${files.ca_key}" -passout pass:${password} 4096',
    ],
    ['$ensureFile', '${dir}/${files.ca_key}'],
  ],
  gen_ca_public_key: [
    'list',
    ['print', '* Generate CA public key'],
    [
      'shell-command',
      'openssl req -new -x509 -days "${validity_days}" -key "${dir}/${files.ca_key}" -sha256 -out "${dir}/${files.ca}" -subj "/C=${country}/ST=${state}/L=${locality}/O=${organization}/OU=${organizationalunit}/CN=${commonname}/emailAddress=${email}" -passin pass:${password}',
    ],
    ['$ensureFile', '${dir}/${files.ca}'],
  ],
  gen_ca: [
    'list',
    ['print', '* Generate CA private and public key'],
    'gen_ca_private_key',
    'gen_ca_public_key',
  ],
  //
  gen_server_key: [
    'list',
    ['print', '* Create a server key'],
    ['shell-command', 'openssl genrsa -out "${dir}/${files.server_key}" 4096'],
    ['$ensureFile', '${dir}/${files.server_key}'],
  ],
  gen_server_csr: [
    'list',
    ['print', '* Create server certificate signing request (CSR)'],
    [
      'shell-command',
      'openssl req -subj "/CN=${commonname}" -sha256 -new -key "${dir}/${files.server_key}" -out "${dir}/${files.server_csr}"',
    ],
    ['$ensureFile', '${dir}/${files.server_csr}'],
  ],
  write_server_ext: [
    'list',
    ['print', '* Create a server ext file'],
    [
      'shell-command',
      "node -e \"const fs=require('fs'); fs.writeFileSync('${dir}/${files.server_ext}', '${serverExtFile}', {encoding:'utf8'});\"",
    ],
    ['$ensureFile', '${dir}/${files.server_ext}'],
  ],
  sign_server_public: [
    'list',
    ['print', '* Sign server public key with our CA'],
    [
      'shell-command',
      'openssl x509 -req -days "${validity_days}" -sha256 -in "${dir}/${files.server_csr}" -CA "${dir}/${files.ca}" -CAkey "${dir}/${files.ca_key}" -CAcreateserial -out "${dir}/${files.server_cert}" -extfile "${dir}/${files.server_ext}"  -passin pass:${password}',
    ],
    ['$ensureFile', '${dir}/${files.server_cert}'],
  ],
  gen_server: [
    'list',
    'gen_server_key',
    'gen_server_csr',
    'write_server_ext',
    'sign_server_public',
  ],
  //
  gen_client_key: [
    'list',
    ['print', '* Create a client key'],
    ['shell-command', 'openssl genrsa -out "${dir}/${files.client_key}" 4096'],
    ['$ensureFile', '${dir}/${files.client_key}'],
  ],
  gen_client_csr: [
    'list',
    ['print', '* Create a client certificate signing request'],
    [
      'shell-command',
      'openssl req -subj "/CN=client" -new -key "${dir}/${files.client_key}" -out "${dir}/${files.client_csr}"',
    ],
    ['$ensureFile', '${dir}/${files.client_csr}'],
  ],
  write_client_ext: [
    'list',
    ['print', '* Create a client ext file'],
    [
      'shell-command',
      "node -e \"const fs=require('fs'); fs.writeFileSync('${dir}/${files.client_ext}', '${clientExtFile}', {encoding:'utf8'});\"",
    ],
    ['$ensureFile', '${dir}/${files.server_ext}'],
  ],
  sign_client_public: [
    'list',
    ['print', '* Sign client public key with our CA'],
    [
      'shell-command',
      'openssl x509 -req -days "${validity_days}" -sha256 -in "${dir}/${files.client_csr}" -CA "${dir}/${files.ca}" -CAkey "${dir}/${files.ca_key}" -CAcreateserial -out "${dir}/${files.client_cert}" -extfile "${dir}/${files.client_ext}"  -passin pass:${password}',
    ],
    ['$ensureFile', '${dir}/${files.server_cert}'],
  ],
  gen_client: [
    'gen_client_key',
    'gen_client_csr',
    'write_client_ext',
    'sign_client_public',
  ],
  //
  cleanup: [
    'list',
    [
      'print',
      '* Remove intermediate csr and extensions config files for client and server',
    ],
    [
      'shell-command',
      'rm "${dir}/${files.server_csr}" "${dir}/${files.client_csr}" "${dir}/${files.server_ext}" "${dir}/${files.client_ext}"',
    ],
    [
      '$ensureNoFile',
      '${dir}/${files.server_csr}',
      '${dir}/${files.client_csr}',
      '${dir}/${files.server_ext}',
      '${dir}/${files.client_ext}',
    ],
  ],
  chmod: [
    'list',
    ['print', '* Make secret keys only readable by you'],
    [
      'shell-command',
      'chmod -v 0400 "${dir}/${files.ca_key}" "${dir}/${files.client_key}" "${dir}/${files.server_key}"',
    ],
    ['print', '* Make certificates world-readable (no write access)'],
    [
      'shell-command',
      'chmod -v 0444 "${dir}/${files.ca}" "${dir}/${files.server_cert}" "${dir}/${files.client_cert}"',
    ],
  ],
  prepare: ['shell-command', 'mkdir -p ${dir}'],
  finalize: ['cleanup', 'chmod'],
  bye: [
    'print',
    '',
    '################################################################################',
    'Certificates were successfully generated',
    '',
    'For the browser it is needed to add "${files.ca_key}" key file to trusted certificate authorities in Chrome security settings:',
    'Settings -> Advanced -> Privacy and security -> Manage certificates -> AUTHORITIES -> IMPORT',
    '(may be needed to remove old cert named "org-{organization}"',
    'Direct link: chrome://settings/certificates',
    '',
    'To copy to remote docker server host use following command:',
    '$ scp ${dir}/{ca*,server*} root@${commonname}:~/.docker/',
    '',
    'To copy to client use following command:',
    '$ scp ${dir}/{ca*,client*} root@${commonname}:~/',
    '',
    '################################################################################',
  ],
  gen_all: [
    'series',
    'prepare',
    'gen_ca',
    'gen_server',
    'gen_client',
    'finalize',
    'bye',
  ],
  default: ['gen_all'],
};

const opemSslActivity: Activity = {
  base_dir: './demo',
  version: '2.5.22',
  actions: {
    default: ['print', 'No default action specified'], // will be overrided
    ...opensslActions,
  },
};
export default opemSslActivity;
