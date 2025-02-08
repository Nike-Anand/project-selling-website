import React, { useState } from 'react';
import { supabase } from '../lib/supabase'; // Import supabase

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { TextField, Button } from '@mui/material';
import { default as Label } from '../components/label';
import { default as Textarea } from '../components/textarea';
import { AlertCircle, Book, DollarSign, Image as ImageIcon, Star } from 'lucide-react';
import Alert from '../components/ui/alert';
import { default as AlertDescription } from '../components/ui/alert';
import Select from 'react-select';

const AddProjectForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    preview_image: '',
    difficulty_level: '',
    category_id: '',
    rating: 0
  });

  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (selectedOption: any, name: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: selectedOption.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validation checks
    if (!formData.title || !formData.description || !formData.price || !formData.preview_image || !formData.difficulty_level) {
      setError('Please fill in all required fields');
      return;
    }
    if (parseFloat(formData.price) < 0) {
      setError('Price must be greater than or equal to 0');
      return;
    }
    
    // Submit to Supabase
    const { error } = await supabase.from("projects").insert([formData]);

    if (error) {
      console.error(error);
      alert("Error adding project");
    } else {
      console.log('Project added:', formData);
      setFormData({
        title: '',
        description: '',
        price: '',
        preview_image: '',
        difficulty_level: '',
        category_id: '',
        rating: 0
      });
      setError('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Book className="w-6 h-6" />
            Create New Course
          </CardTitle>
          <CardDescription>
            Fill in the details below to create a new course
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Course Title</Label>
              <TextField
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter course title"
                fullWidth
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter course description"
                className="min-h-32"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Price
                </Label>
                <TextField
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  fullWidth
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty_level">Difficulty Level</Label>
                <Select
                  options={[
                    { value: 'Beginner', label: 'Beginner' },
                    { value: 'Intermediate', label: 'Intermediate' },
                    { value: 'Advanced', label: 'Advanced' }
                  ]}
                  onChange={(selectedOption) => handleSelectChange(selectedOption, 'difficulty_level')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preview_image" className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Preview Image URL
              </Label>
              <TextField
                id="preview_image"
                name="preview_image"
                value={formData.preview_image}
                onChange={handleInputChange}
                placeholder="Enter image URL"
                fullWidth
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating" className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                Initial Rating (0-5)
              </Label>
              <TextField
                id="rating"
                name="rating"
                type="number"
                value={formData.rating}
                onChange={handleInputChange}
                placeholder="0.0"
                fullWidth
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4">
          <Button variant="outlined" onClick={() => setFormData({
            title: '',
            description: '',
            price: '',
            preview_image: '',
            difficulty_level: '',
            category_id: '',
            rating: 0
          })}>
            Reset
          </Button>
          <Button onClick={handleSubmit} className="px-8">
            Create Course
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AddProjectForm;
