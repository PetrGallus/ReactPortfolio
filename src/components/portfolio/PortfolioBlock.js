import React from 'react';
import IconLink from "./IconLink";
import {Box} from "@mui/material";

function PortfolioBlock(props) {
   const {image, live, source, title, liveText, sourceText} = props;
   return (
      <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
         <Box component={'img'} src={image} alt={'mockup'}
              sx={{
                  maxWidth: '400px',
                  maxHeight: '300px',
                  width: '100%',
                  height: 'auto',
                  objectFit: 'cover',
                  display: 'block'
              }}
         />
         <h1 style={{fontSize: '2rem'}}>{title}</h1>
         <Box className={'portfolio'} display={'flex'} flexDirection={'column'} gap={'0.5rem'}
              alignItems={'center'} fontSize={'1.5rem'} py={'2rem'}>
            <Box p={1} border={'2px solid black'} borderRadius={'25px'}>
               <IconLink link={live} title={liveText || 'Live Demo'} icon={'fa fa-star'}/>
            </Box>
            <Box p={1} border={'2px solid black'} borderRadius={'25px'}>
               <IconLink link={source} title={sourceText || 'Source Code'} icon={'fa fa-code'}/>
            </Box>
         </Box>
      </Box>
   );
}

export default PortfolioBlock;