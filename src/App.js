import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import styles from './App.module.css';
import PageNotFound from './Components/PageNotFound/PageNotFound';
import Home from './Components/Home/Home';
import About from './Components/About/About';
import Contact from './Components/Contact/Contact';
import NavBar from './Components/NavBar/NavBar';
import Footer from './Components/Footer/Footer';
import Background from './Components/Background/Background';
import Education from './Components/Background/Education/Education';
import Experience from './Components/Background/Experience/Experience';
import Project from './Components/Project/Project';

const App = () => (
  <BrowserRouter>
    <div className={styles.appShell}>
      <NavBar />
      <main className={styles.pageContent}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/background' element={<Background />}>
            <Route index element={<Experience />} />
            <Route path='experience' element={<Navigate to='/background' replace />} />
            <Route path='education' element={<Education />} />
            <Route path='achievements' element={<Navigate to='/background' replace />} />
            <Route path='skills' element={<Navigate to='/background' replace />} />
          </Route>
          <Route path='/project' element={<Project />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  </BrowserRouter>
);

export default App;

