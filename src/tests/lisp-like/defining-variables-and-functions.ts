import {Activity} from "../../lib/config";

export const config: Activity = {
  base_dir: './demo',
  version: '2.5.22',
  actions: {
    default: [ '$series',
      [ 'test_setq' ],

    ],
    test_setq: [ '$series',
      [ 'setq', 'abc', 1 ],
      [ '$expect', '${abc}', 1 ],
    ]
  },
}

export default config;
