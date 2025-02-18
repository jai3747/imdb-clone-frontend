// import React, { useEffect, useState, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { api } from "./config/api.config";
// import { useFormik } from "formik";
// import * as yup from "yup";
// import {
//   TextField,
//   Button,
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Select,
//   CircularProgress,
//   Alert,
//   Container,
//   Box,
//   Typography,
//   Chip,
//   OutlinedInput,
//   FormHelperText,
//   Paper,
//   IconButton,
//   Tooltip
// } from "@mui/material";
// import { Info as InfoIcon } from '@mui/icons-material';

// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
//   PaperProps: {
//     style: {
//       maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//       width: 250,
//     },
//   },
// };

// const ALLOWED_IMAGE_SOURCES = [
//   {
//     domain: 'imgur.com',
//     example: 'https://i.imgur.com/example.jpg',
//     description: 'Imgur'
//   },
//   {
//     domain: 'upload.wikimedia.org',
//     example: 'https://upload.wikimedia.org/wikipedia/commons/example.jpg',
//     description: 'Wikimedia Commons'
//   },
//   {
//     domain: 'images.unsplash.com',
//     example: 'https://images.unsplash.com/photo-example.jpg',
//     description: 'Unsplash'
//   },
//   {
//     domain: 'res.cloudinary.com',
//     example: 'https://res.cloudinary.com/your-cloud-name/image/upload/example.jpg',
//     description: 'Cloudinary'
//   },
//   {
//     domain: 'drive.google.com',
//     example: 'https://drive.google.com/uc?export=view&id=YOUR_FILE_ID',
//     description: 'Google Drive (public links only)'
//   }
// ];

// // Function to convert Google Drive sharing URL to direct image URL
// const convertGoogleDriveURL = (url) => {
//   try {
//     const urlObj = new URL(url);
//     if (urlObj.hostname === 'drive.google.com') {
//       if (url.includes('/file/d/')) {
//         const fileId = url.match(/\/file\/d\/([^/]+)/)?.[1];
//         if (fileId) {
//           return `https://drive.google.com/uc?export=view&id=${fileId}`;
//         }
//       } else if (url.includes('uc?export=view&id=')) {
//         return url;
//       }
//     }
//     return url;
//   } catch {
//     return url;
//   }
// };

// // Function to validate image URL
// const isValidImageUrl = (url) => {
//   try {
//     const convertedUrl = convertGoogleDriveURL(url);
//     const urlObj = new URL(convertedUrl);
//     const hostname = urlObj.hostname;
    
//     const isAllowedDomain = ALLOWED_IMAGE_SOURCES.some(({ domain }) => 
//       hostname === domain || hostname.endsWith(`.${domain}`)
//     );

//     const isHttps = urlObj.protocol === 'https:';

//     const hasImageExtension = /\.(jpg|jpeg|png|gif|webp)$/i.test(urlObj.pathname) ||
//       (urlObj.hostname === 'drive.google.com' && urlObj.searchParams.has('export')) ||
//       urlObj.hostname.endsWith('cloudinary.com');

//     return isAllowedDomain && isHttps && hasImageExtension;
//   } catch {
//     return false;
//   }
// };

// // Custom Yup test for image URL validation
// yup.addMethod(yup.string, 'isValidImageUrl', function (errorMessage) {
//   return this.test('test-valid-image-url', errorMessage, function (value) {
//     const { path, createError } = this;
//     return !value || isValidImageUrl(value) || createError({
//       path,
//       message: errorMessage
//     });
//   });
// });

// const movieValidationSchema = yup.object({
//   name: yup
//     .string()
//     .required("Movie name is required")
//     .min(3, "Movie name must be at least 3 characters")
//     .max(100, "Movie name must not exceed 100 characters")
//     .trim(),
//   desc: yup
//     .string()
//     .required("Description is required")
//     .min(10, "Description must be at least 10 characters")
//     .max(2000, "Description must not exceed 2000 characters")
//     .trim(),
//   director: yup
//     .string()
//     .required("Director name is required")
//     .min(3, "Director name must be at least 3 characters")
//     .max(100, "Director name must not exceed 100 characters")
//     .trim(),
//   poster: yup
//     .string()
//     .required("Poster URL is required")
//     .url("Must be a valid URL")
//     .isValidImageUrl("Must be a valid HTTPS image URL from an allowed domain")
//     .trim(),
//   yearOfRelease: yup
//     .number()
//     .required("Release year is required")
//     .min(1888, "Year must be 1888 or later")
//     .max(new Date().getFullYear() + 5, "Year cannot be more than 5 years in the future"),
//   producer: yup
//     .string()
//     .required("Producer selection is required"),
//   actors: yup
//     .array()
//     .min(1, "Please select at least one actor")
//     .max(20, "Cannot select more than 20 actors")
//     .required("Actor selection is required")
// });

// const AddMovie = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [initialLoading, setInitialLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [producers, setProducers] = useState([]);
//   const [actors, setActors] = useState([]);
//   const [previewUrl, setPreviewUrl] = useState("");
//   const [imageError, setImageError] = useState(false);
//   const [imageLoading, setImageLoading] = useState(false);
//   const [showImageHelp, setShowImageHelp] = useState(false);

//   const validateImageUrl = useCallback(async (url) => {
//     if (!url) return false;
//     const convertedUrl = convertGoogleDriveURL(url);
//     if (!isValidImageUrl(convertedUrl)) return false;

//     setImageLoading(true);
//     return new Promise((resolve) => {
//       const img = new Image();
//       img.onload = () => {
//         setImageLoading(false);
//         resolve(true);
//       };
//       img.onerror = () => {
//         setImageLoading(false);
//         resolve(false);
//       };
//       img.src = convertedUrl;
//     });
//   }, []);

//   const formik = useFormik({
//     initialValues: {
//       name: "",
//       desc: "",
//       director: "",
//       poster: "",
//       yearOfRelease: new Date().getFullYear(),
//       producer: "",
//       actors: []
//     },
//     validationSchema: movieValidationSchema,
//     onSubmit: async (values) => {
//       try {
//         setLoading(true);
//         setError(null);

//         const convertedPosterUrl = convertGoogleDriveURL(values.poster);
        
//         const isImageValid = await validateImageUrl(convertedPosterUrl);
//         if (!isImageValid) {
//           formik.setFieldError('poster', 'Unable to load image from this URL');
//           setLoading(false);
//           return;
//         }

//         const submitValues = {
//           ...values,
//           poster: convertedPosterUrl
//         };

//         await api.movies.add(submitValues);
//         navigate("/");
//       } catch (err) {
//         setError(err.response?.data?.message || "Failed to add movie. Please try again.");
//         console.error("Add movie error:", err);
//       } finally {
//         setLoading(false);
//       }
//     }
//   });

//   useEffect(() => {
//     loadInitialData();
//   }, []);

//   useEffect(() => {
//     const validateAndSetPreview = async () => {
//       const url = formik.values.poster;
//       if (url) {
//         const convertedUrl = convertGoogleDriveURL(url);
//         if (isValidImageUrl(convertedUrl)) {
//           setImageLoading(true);
//           setPreviewUrl(convertedUrl);
//           const isValid = await validateImageUrl(convertedUrl);
//           setImageError(!isValid);
//         } else {
//           setPreviewUrl("");
//           setImageError(false);
//         }
//       }
//     };

//     validateAndSetPreview();
//   }, [formik.values.poster, validateImageUrl]);

//   const loadInitialData = async () => {
//     try {
//       setInitialLoading(true);
//       const [producersRes, actorsRes] = await Promise.all([
//         api.producers.getAll(),
//         api.actors.getAll()
//       ]);
//       setProducers(producersRes.data);
//       setActors(actorsRes.data);
//     } catch (err) {
//       setError("Failed to load producers and actors. Please try again later.");
//       console.error("Load initial data error:", err);
//     } finally {
//       setInitialLoading(false);
//     }
//   };

//   if (initialLoading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Container maxWidth="md">
//       <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 4, mb: 4 }}>
//         <Typography variant="h4" gutterBottom>
//           Add New Movie
//         </Typography>

//         {error && (
//           <Alert severity="error" sx={{ mb: 2 }}>
//             {error}
//           </Alert>
//         )}

//         <Box sx={{ display: 'grid', gap: 2 }}>
//           <TextField
//             fullWidth
//             label="Movie Name"
//             {...formik.getFieldProps('name')}
//             error={formik.touched.name && Boolean(formik.errors.name)}
//             helperText={formik.touched.name && formik.errors.name}
//           />

//           <TextField
//             fullWidth
//             multiline
//             rows={4}
//             label="Description"
//             {...formik.getFieldProps('desc')}
//             error={formik.touched.desc && Boolean(formik.errors.desc)}
//             helperText={formik.touched.desc && formik.errors.desc}
//           />

//           <TextField
//             fullWidth
//             label="Director"
//             {...formik.getFieldProps('director')}
//             error={formik.touched.director && Boolean(formik.errors.director)}
//             helperText={formik.touched.director && formik.errors.director}
//           />

//           <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
//             <Box sx={{ flex: 1 }}>
//               <TextField
//                 fullWidth
//                 label="Poster URL"
//                 {...formik.getFieldProps('poster')}
//                 error={formik.touched.poster && Boolean(formik.errors.poster)}
//                 helperText={
//                   (formik.touched.poster && formik.errors.poster) ||
//                   "Enter a HTTPS URL from one of the allowed sources"
//                 }
//                 InputProps={{
//                   endAdornment: (
//                     <Tooltip title="Click for allowed image sources">
//                       <IconButton 
//                         size="small" 
//                         onClick={() => setShowImageHelp(!showImageHelp)}
//                       >
//                         <InfoIcon />
//                       </IconButton>
//                     </Tooltip>
//                   ),
//                 }}
//               />
//               {showImageHelp && (
//                 <Paper sx={{ mt: 1, p: 2 }}>
//                   <Typography variant="subtitle2" gutterBottom>
//                     Allowed Image Sources:
//                   </Typography>
//                   {ALLOWED_IMAGE_SOURCES.map(({ description, example }) => (
//                     <Box key={description} sx={{ mb: 1 }}>
//                       <Typography variant="body2" color="text.secondary">
//                         {description}:
//                       </Typography>
//                       <Typography variant="caption" display="block" sx={{ wordBreak: 'break-all' }}>
//                         Example: {example}
//                       </Typography>
//                     </Box>
//                   ))}
//                 </Paper>
//               )}
//             </Box>
//             {(previewUrl || imageLoading) && (
//               <Paper 
//                 elevation={3} 
//                 sx={{ 
//                   p: 1,
//                   width: 150,
//                   height: 200,
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   backgroundColor: '#f5f5f5'
//                 }}
//               >
//                 {imageLoading ? (
//                   <CircularProgress size={24} />
//                 ) : imageError ? (
//                   <Typography variant="caption" color="error" align="center">
//                     Failed to load image
//                   </Typography>
//                 ) : (
//                   <img
//                     src={previewUrl}
//                     alt="Poster preview"
//                     style={{ 
//                       maxWidth: '100%',
//                       maxHeight: '100%',
//                       objectFit: 'contain'
//                     }}
//                     onError={() => setImageError(true)}
//                   />
//                 )}
//               </Paper>
//             )}
//           </Box>

//           <TextField
//             fullWidth
//             type="number"
//             label="Year of Release"
//             {...formik.getFieldProps('yearOfRelease')}
//             error={formik.touched.yearOfRelease && Boolean(formik.errors.yearOfRelease)}
//             helperText={formik.touched.yearOfRelease && formik.errors.yearOfRelease}
//           />

//           <FormControl 
//             fullWidth
//             error={formik.touched.producer && Boolean(formik.errors.producer)}
//           >
//             <InputLabel>Producer</InputLabel>
//             <Select
//               {...formik.getFieldProps('producer')}
//               label="Producer"
//             >
//               {producers.map(producer => (
//                 <MenuItem key={producer._id} value={producer._id}>
//                   {producer.name}
//                 </MenuItem>
//               ))}
//             </Select>
//             {formik.touched.producer && formik.errors.producer && (
//               <FormHelperText>{formik.errors.producer}</FormHelperText>
//             )}
//           </FormControl>

//           <FormControl 
//             fullWidth
//             error={formik.touched.actors && Boolean(formik.errors.actors)}
//           >
//             <InputLabel>Actors</InputLabel>
//             <Select
//               multiple
//               {...formik.getFieldProps('actors')}
//               input={<OutlinedInput label="Actors" />}
//               renderValue={(selected) => (
//                 <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                   {selected.map((value) => (
//                     <Chip
//                       key={value}
//                       label={actors.find(actor => actor._id === value)?.name}
//                       size="small"
//                     />
//                   ))}
//                 </Box>
//               )}
//               MenuProps={MenuProps}
//             >
//               {actors.map(actor => (
//                 <MenuItem key={actor._id} value={actor._id}>
//                   {actor.name}
//                 </MenuItem>
//               ))}
//             </Select>
//             {formik.touched.actors && formik.errors.actors && (
//               <FormHelperText>{formik.errors.actors}</FormHelperText>
//             )}
//           </FormControl>

//           <Button
//             variant="contained"
//             type="submit"
//             disabled={loading}
//             size="large"
//             sx={{ mt: 2 }}
//           >
//             {loading ? (
//               <CircularProgress size={24} sx={{ color: 'white' }} />
//             ) : (
//               'Add Movie'
//             )}
//           </Button>
//         </Box>
//       </Box>
//     </Container>
//   );
// };

// export default AddMovie;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "./config/api.config";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  CircularProgress,
  Alert,
  Container,
  Box,
  Typography,
  Chip,
  OutlinedInput,
  FormHelperText,
} from "@mui/material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const movieValidationSchema = yup.object({
  name: yup
    .string()
    .required("Movie name is required")
    .min(3, "Movie name must be at least 3 characters")
    .max(100, "Movie name must not exceed 100 characters")
    .trim(),
  desc: yup
    .string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must not exceed 2000 characters")
    .trim(),
  director: yup
    .string()
    .required("Director name is required")
    .min(3, "Director name must be at least 3 characters")
    .max(100, "Director name must not exceed 100 characters")
    .trim(),
  poster: yup
    .string()
    .required("Poster URL is required")
    .url("Must be a valid URL")
    .trim(),
  yearOfRelease: yup
    .number()
    .required("Release year is required")
    .min(1888, "Year must be 1888 or later")
    .max(new Date().getFullYear() + 5, "Year cannot be more than 5 years in the future"),
  producer: yup
    .string()
    .required("Producer selection is required"),
  actors: yup
    .array()
    .min(1, "Please select at least one actor")
    .max(20, "Cannot select more than 20 actors")
    .required("Actor selection is required")
});

const AddMovie = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [producers, setProducers] = useState([]);
  const [actors, setActors] = useState([]);

  const formik = useFormik({
    initialValues: {
      name: "",
      desc: "",
      director: "",
      poster: "",
      yearOfRelease: new Date().getFullYear(),
      producer: "",
      actors: []
    },
    validationSchema: movieValidationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError(null);
        await api.movies.add(values);
        navigate("/");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to add movie. Please try again.");
        console.error("Add movie error:", err);
      } finally {
        setLoading(false);
      }
    }
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setInitialLoading(true);
      const [producersRes, actorsRes] = await Promise.all([
        api.producers.getAll(),
        api.actors.getAll()
      ]);
      setProducers(producersRes.data);
      setActors(actorsRes.data);
    } catch (err) {
      setError("Failed to load producers and actors. Please try again later.");
      console.error("Load initial data error:", err);
    } finally {
      setInitialLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Add New Movie
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'grid', gap: 2 }}>
          <TextField
            fullWidth
            label="Movie Name"
            {...formik.getFieldProps('name')}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description"
            {...formik.getFieldProps('desc')}
            error={formik.touched.desc && Boolean(formik.errors.desc)}
            helperText={formik.touched.desc && formik.errors.desc}
          />

          <TextField
            fullWidth
            label="Director"
            {...formik.getFieldProps('director')}
            error={formik.touched.director && Boolean(formik.errors.director)}
            helperText={formik.touched.director && formik.errors.director}
          />

          <TextField
            fullWidth
            label="Poster URL"
            {...formik.getFieldProps('poster')}
            error={formik.touched.poster && Boolean(formik.errors.poster)}
            helperText={formik.touched.poster && formik.errors.poster}
          />

          <TextField
            fullWidth
            type="number"
            label="Year of Release"
            {...formik.getFieldProps('yearOfRelease')}
            error={formik.touched.yearOfRelease && Boolean(formik.errors.yearOfRelease)}
            helperText={formik.touched.yearOfRelease && formik.errors.yearOfRelease}
          />

          <FormControl 
            fullWidth
            error={formik.touched.producer && Boolean(formik.errors.producer)}
          >
            <InputLabel>Producer</InputLabel>
            <Select
              {...formik.getFieldProps('producer')}
              label="Producer"
            >
              {producers.map(producer => (
                <MenuItem key={producer._id} value={producer._id}>
                  {producer.name}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.producer && formik.errors.producer && (
              <FormHelperText>{formik.errors.producer}</FormHelperText>
            )}
          </FormControl>

          <FormControl 
            fullWidth
            error={formik.touched.actors && Boolean(formik.errors.actors)}
          >
            <InputLabel>Actors</InputLabel>
            <Select
              multiple
              {...formik.getFieldProps('actors')}
              input={<OutlinedInput label="Actors" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={actors.find(actor => actor._id === value)?.name}
                      size="small"
                    />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {actors.map(actor => (
                <MenuItem key={actor._id} value={actor._id}>
                  {actor.name}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.actors && formik.errors.actors && (
              <FormHelperText>{formik.errors.actors}</FormHelperText>
            )}
          </FormControl>

          <Button
            variant="contained"
            type="submit"
            disabled={loading}
            size="large"
            sx={{ mt: 2 }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : (
              'Add Movie'
            )}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AddMovie;