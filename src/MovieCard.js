// // import { useState } from "react";
// // import Button from "@mui/material/Button";
// // import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// // import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
// // import Card from "@mui/material/Card";
// // import CardMedia from "@mui/material/CardMedia";
// // import { CardActions, CardContent } from "@mui/material";
// // import { LikeDislike } from "./LikeDislike";

// // export function MovieCard({
// //   id,
// //   name,
// //   desc,
// //   director,
// //   yearOfRelease,
// //   poster,
// //   producer,
// //   actors,
// //   deleteButton,
// //   editButton,
// // }) {
// //   const [show, setShow] = useState(false);

// //   return (
// //     <Card className="movie-container">
// //       <CardMedia
// //         component="img"
// //         className="movie-poster"
// //         src={poster}
// //         alt={name}
// //       />
// //       <CardContent>
// //         <div className="movie-specs">
// //           <h3 className="movie-name">
// //             {name}
// //             <Button onClick={() => setShow(!show)}>
// //               {show ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
// //             </Button>
// //             <span className="yearOfRelease">{yearOfRelease}</span>
// //           </h3>
// //         </div>
// //       </CardContent>

// //       {show ? <p className="movie-summary">{desc}</p> : ""}
// //       <div>
// //         <p className="label">
// //           Director : <span className="names">{director}</span>
// //         </p>
// //         <p className="label">
// //           Producer : <span className="names">{producer.name}</span>
// //         </p>
// //         <p className="label">
// //           Actors :{" "}
// //           <span className="names">
// //             {actors.map((actor) => (
// //               <span>{actor.name}, </span>
// //             ))}{" "}
// //           </span>
// //         </p>
// //       </div>
// //       <div className="custom-buttons">
// //         <CardActions>
// //           <LikeDislike />
// //         </CardActions>
// //         <div>
// //           {editButton}
// //           {deleteButton}
// //         </div>
// //       </div>
// //     </Card>
// //   );
// // }
// // MovieCard.js - Fixed key prop issue
// export const MovieCard = ({ 
//   _id,
//   name,
//   desc,
//   director,
//   yearOfRelease,
//   poster,
//   producer,
//   actors,
//   onDelete,
//   onEdit 
// }) => {
//   return (
//     <Card className="movie-card">
//       <CardMedia
//         component="img"
//         height="140"
//         image={poster}
//         alt={name}
//       />
//       <CardContent>
//         <Typography variant="h5">{name}</Typography>
//         <Typography variant="body2">{desc}</Typography>
//         <Typography variant="body2">
//           {actors.map((actor, index) => (
//             <span key={actor._id}>
//               {actor.name}{index < actors.length - 1 ? ', ' : ''}
//             </span>
//           ))}
//         </Typography>
//       </CardContent>
//       <CardActions>
//         <IconButton onClick={onEdit} color="primary">
//           <EditIcon />
//         </IconButton>
//         <IconButton onClick={onDelete} color="error">
//           <DeleteIcon />
//         </IconButton>
//       </CardActions>
//     </Card>
//   );
// };
// src/MovieCard.js
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  CardActions, 
  Typography, 
  IconButton 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export const MovieCard = ({ 
  _id,
  name,
  desc,
  director,
  yearOfRelease,
  poster,
  producer,
  actors,
  onDelete,
  onEdit 
}) => {
  return (
    <Card className="movie-card">
      <CardMedia
        component="img"
        height="140"
        image={poster}
        alt={name}
      />
      <CardContent>
        <Typography variant="h5">{name}</Typography>
        <Typography variant="body2">{desc}</Typography>
        <Typography variant="body2">
          {actors.map((actor, index) => (
            <span key={actor._id}>
              {actor.name}{index < actors.length - 1 ? ', ' : ''}
            </span>
          ))}
        </Typography>
      </CardContent>
      <CardActions>
        <IconButton onClick={onEdit} color="primary">
          <EditIcon />
        </IconButton>
        <IconButton onClick={onDelete} color="error">
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};
