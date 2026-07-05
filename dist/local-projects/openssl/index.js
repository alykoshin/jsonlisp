"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.opensslActions_ = void 0;
exports.opensslActions_ = {
    _gen_ca_private_key: [
        'list',
        ['print', '* Generate CA private key'],
        [
            'shell-command',
            'openssl genrsa -aes256 -out "${dir}/${files.ca_key}" -passout pass:${password} 4096',
        ],
        ['$ensureFile', '${dir}/${files.ca_key}'],
    ],
    _gen_ca_public_key: [
        'list',
        ['print', '* Generate CA public key'],
        [
            'shell-command',
            'openssl req -new -x509 -days "${validity_days}" -key "${dir}/${files.ca_key}" -sha256 -out "${dir}/${files.ca}" -subj "/C=${country}/ST=${state}/L=${locality}/O=${organization}/OU=${organizationalunit}/CN=${commonname}/emailAddress=${email}" -passin pass:${password}',
        ],
        ['$ensureFile', '${dir}/${files.ca}'],
    ],
    _gen_ca: [
        'list',
        ['print', '* Generate CA private and public key'],
        ['_gen_ca_private_key'],
        ['_gen_ca_public_key'],
    ],
    //
    _gen_server_key: [
        'list',
        ['print', '* Create a server key'],
        ['shell-command', 'openssl genrsa -out "${dir}/${files.server_key}" 4096'],
        ['$ensureFile', '${dir}/${files.server_key}'],
    ],
    _gen_server_csr: [
        'list',
        ['print', '* Create server certificate signing request (CSR)'],
        [
            'shell-command',
            'openssl req -subj "/CN=${commonname}" -sha256 -new -key "${dir}/${files.server_key}" -out "${dir}/${files.server_csr}"',
        ],
        ['$ensureFile', '${dir}/${files.server_csr}'],
    ],
    _write_server_ext: [
        'list',
        ['print', '* Create a server ext file'],
        [
            'shell-command',
            "node -e \"const fs=require('fs'); fs.writeFileSync('${dir}/${files.server_ext}', '${serverExtFile}', {encoding:'utf8'});\"",
        ],
        ['$ensureFile', '${dir}/${files.server_ext}'],
    ],
    _sign_server_public: [
        'list',
        ['print', '* Sign server public key with our CA'],
        [
            'shell-command',
            'openssl x509 -req -days "${validity_days}" -sha256 -in "${dir}/${files.server_csr}" -CA "${dir}/${files.ca}" -CAkey "${dir}/${files.ca_key}" -CAcreateserial -out "${dir}/${files.server_cert}" -extfile "${dir}/${files.server_ext}"  -passin pass:${password}',
        ],
        ['$ensureFile', '${dir}/${files.server_cert}'],
    ],
    _gen_server: [
        'list',
        ['_gen_server_key'],
        ['_gen_server_csr'],
        ['_write_server_ext'],
        ['_sign_server_public'],
    ],
    //
    _gen_client_key: [
        'list',
        ['print', '* Create a client key'],
        ['shell-command', 'openssl genrsa -out "${dir}/${files.client_key}" 4096'],
        ['$ensureFile', '${dir}/${files.client_key}'],
    ],
    _gen_client_csr: [
        'list',
        ['print', '* Create a client certificate signing request'],
        [
            'shell-command',
            'openssl req -subj "/CN=client" -new -key "${dir}/${files.client_key}" -out "${dir}/${files.client_csr}"',
        ],
        ['$ensureFile', '${dir}/${files.client_csr}'],
    ],
    _write_client_ext: [
        'list',
        ['print', '* Create a client ext file'],
        [
            'shell-command',
            "node -e \"const fs=require('fs'); fs.writeFileSync('${dir}/${files.client_ext}', '${clientExtFile}', {encoding:'utf8'});\"",
        ],
        ['$ensureFile', '${dir}/${files.client_ext}'],
    ],
    _sign_client_public: [
        'list',
        ['print', '* Sign client public key with our CA'],
        [
            'shell-command',
            'openssl x509 -req -days "${validity_days}" -sha256 -in "${dir}/${files.client_csr}" -CA "${dir}/${files.ca}" -CAkey "${dir}/${files.ca_key}" -CAcreateserial -out "${dir}/${files.client_cert}" -extfile "${dir}/${files.client_ext}"  -passin pass:${password}',
        ],
        ['$ensureFile', '${dir}/${files.client_cert}'],
    ],
    _gen_client: [
        'list',
        ['_gen_client_key'],
        ['_gen_client_csr'],
        ['_write_client_ext'],
        ['_sign_client_public'],
    ],
    //
    _cleanup: [
        'list',
        [
            'print',
            '* Remove intermediate csr and extensions config files for client and server',
        ],
        [
            'shell-command',
            'rm "${dir}/${files.server_csr}" "${dir}/${files.server_ext}" "${dir}/${files.client_csr}" "${dir}/${files.client_ext}"',
        ],
        [
            '$ensureNoFile',
            '${dir}/${files.server_csr}',
            '${dir}/${files.server_ext}',
            '${dir}/${files.client_csr}',
            '${dir}/${files.client_ext}',
        ],
    ],
    _chmod: [
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
    // _prepare: ['shell-command', 'mkdir -p ${dir}'],
    _prepare: ['ensure-directories-exist', '${dir}'],
    _finalize: ['list', ['_cleanup'], ['_chmod']],
    _bye: [
        'print',
        [
            '+',
            '\n',
            '################################################################################\n',
            'Certificates were successfully generated\n',
            '\n',
            'To install certificates at localhost\n',
            '\n',
            '  For the browser it is needed to add "${dir}/${files.ca_key}" key file to trusted certificate authorities in Chrome security settings:\n',
            '  Settings -> Advanced -> Privacy and security -> Manage certificates -> AUTHORITIES -> IMPORT\n',
            '  (may be needed to remove old cert named "org-{organization}"\n',
            '  Direct link: chrome://settings/security?search=certificates',
            '  (for older version of Chrome: chrome://settings/certificates)\n',
            '\n',
            '  For Windows you may also import CA file to certificate store:\n',
            '    - Search -> Certificates -> Console Root -> Certificates (Local Computer)\n',
            '    - Right click on "Trusted Root Certification Authorities" -> All Tasks -> Import...\n',
            '    - Select "${dir}/${files.ca}" file\n',
            '  The certificate will be visible under "Console Root/Certificates (Local Computer)/Trusted Root Certification Authorities/Registry/Certificates/${commonname}"\n',
            '\n',
            // https://superuser.com/questions/1031444/importing-pem-certificates-on-windows-7-on-the-command-line
            '  From command line (with elevated priviligies):',
            '  - To add Trusted Root Certification Authorities to the Local Computer store (under EnterpriseCertificates):',
            '    certutil -addstore -enterprise -f "Root" ${dir}/${files.ca}\n',
            '  - To add Trusted Root Certification Authorities to the User store:',
            '    certutil -addstore -f "Root" ${dir}/${files.ca}\n',
            '  - To add Intermediate Certification Authority to the Local Computer store:',
            '    certutil -addstore -enterprise -f "CA" ${dir}/${files.ca}\n',
            '  - To add Intermediate Certification Authority to the User store:',
            '    certutil -addstore -f "CA" ${dir}/${files.ca}\n',
            '\n',
            '  You may need to remove previous version of the certificate.\n',
            '\n',
            '  You will need to restart your browser.\n',
            '\n',
            'If you use docker at remote server:\n',
            '\n',
            '- To copy to remote docker server host use following command:\n',
            '  $ scp ${dir}/{ca*,server*} root@${commonname}:~/.docker/\n',
            '\n',
            '- To copy to client use following command:\n',
            '  $ scp ${dir}/{ca*,client*} root@${commonname}:~/\n',
            '\n',
            '  (change directories above according to your actual configuration\n',
            '\n',
            '################################################################################',
        ],
    ],
    //
    gen_all: [
        'list',
        ['_prepare'],
        ['_gen_ca'],
        ['_gen_server'],
        ['_gen_client'],
        ['_finalize'],
        ['_bye'],
    ],
    default: ['gen_all'],
};
const openSslActivity = {
    base_dir: './demo',
    version: '2.5.22',
    actions: {
        default: ['print', 'No default action specified'],
        ...exports.opensslActions_,
    },
};
// console.log(openSslActivity);
exports.default = openSslActivity;
//# sourceMappingURL=index.js.map