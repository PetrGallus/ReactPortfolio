import React from 'react';
import Style from "./Terminal.module.scss";
import classNames from "classnames";
import {Box} from "@mui/material";

function Terminal(props) {
   const {text} = props;

   return (
      <Box
         component={'section'}
         className={classNames(Style.terminal, Style.shadowed)}
         width={{xs: '90%', md: '60%'}}
         borderRadius={'1.2rem'}
         mb={'4rem'}
         sx={{
            background: 'linear-gradient(135deg, #ffe0f7 0%, #e0f7fa 100%)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
            border: '2px solid #f8bbd0',
            position: 'relative',
            overflow: 'visible'
         }}
      >
         {/* Horní růžová lišta s kroužky */}
         <Box
            sx={{
               background: '#f8bbd0',
               borderRadius: '1.2rem 1.2rem 0 0',
               height: '2.2rem',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               position: 'relative'
            }}
         >
            {[...Array(6)].map((_, i) => (
               <Box
                  key={i}
                  sx={{
                     width: '18px',
                     height: '18px',
                     background: '#fff',
                     border: '2px solid #f06292',
                     borderRadius: '50%',
                     margin: '0 0.5rem',
                     boxShadow: '0 2px 6px #f0629240'
                  }}
               />
            ))}
         </Box>
         {/* Papírová část kalendáře */}
         <Box
            py={{xs: '1.5rem', md: '2.5rem'}}
            px={{xs: '2rem', md: '3rem'}}
            borderRadius={'0 0 1.2rem 1.2rem'}
            sx={{
               background: '#fff',
               minHeight: '120px',
               fontFamily: 'Comic Sans MS, Comic Sans, cursive, sans-serif',
               color: '#ad1457',
               fontSize: '1.3rem',
               boxShadow: '0 2px 8px #f8bbd080'
            }}
         >
            {text}
         </Box>
      </Box>
   );
}

export default Terminal;