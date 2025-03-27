// import { extendTheme } from '@chakra-ui/react'
import { createSystem, defaultConfig } from "@chakra-ui/react"


import {  Unbounded, Lexend_Mega, Public_Sans, Archivo, DM_Sans, Red_Hat_Text, 
  RocknRoll_One, Work_Sans,
  Noto_Serif, Zen_Kaku_Gothic_New, Dela_Gothic_One, Murecho
  } from 'next/font/google'

const neobrutalismFont1 = Unbounded({ subsets: [ 'latin' ], weight: ['400'] })
const neobrutalismFont2 = Lexend_Mega({ subsets: [ 'latin' ], weight: ['600'] })
const neobrutalismFont3 = Public_Sans({ subsets: [ 'latin' ], weight: ['400'] })
const neobrutalismFont4 = Archivo({ subsets: [ 'latin' ], weight: ['400'] })
const neobrutalismFont5Head = DM_Sans({ subsets: [ 'latin' ], weight: ['700'] })
const neobrutalismFont5Text = DM_Sans({ subsets: [ 'latin' ], weight: ['400'] })
const neobrutalismFont6 = Red_Hat_Text({ subsets: [ 'latin' ], weight: ['400'] })
const neobrutalismFont7 = Work_Sans({ subsets: [ 'latin' ], weight: ['600'] }) //Other Good Option

const logoFont = RocknRoll_One({ subsets: [ 'latin' ], weight: ['400'] })
const logoFont2 = Zen_Kaku_Gothic_New({ subsets: [ 'latin' ], weight: ['400'] })
const logoFont3= Dela_Gothic_One({ subsets: [ 'latin' ], weight: ['400'] })
const logoFont4 = Noto_Serif({ subsets: [ 'latin' ], weight: ['400'] })
const logoFont5 = Murecho({ subsets: [ 'latin' ], weight: ['400'] })



const system = createSystem(defaultConfig, {
    theme: {
        tokens: {
          fonts: {
            heading: { value: `'Figtree', sans-serif` },
            body: { value: `'Figtree', sans-serif` },
          },
        },
      },

})

export default system 