import { Component, inject, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { GradeInfoComponent } from '../../../components/grade/grade-info/grade-info.component';
import { GradeComponent } from '../../../components/grade/grade.component';
import { Grade } from '../../../models/grade.models';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Filters {
  education: {
    formal: string[];
    self: string[];
  };
  experience: {
    total: string[];
    teamSize: string[];
  };
  hardSkills: string[];
  softSkills: string[];
  projectSkills: string[];
}

@Component({
  selector: 'app-grades',
  standalone: true,
  imports: [
    CommonModule,
    GradeComponent,
    MatSidenavModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    FormsModule
  ],
  templateUrl: './grades.component.html',
  styleUrl: './grades.component.scss'
})
export class GradesComponent implements OnInit {
  dialog = inject(MatDialog);
  @Input() grades: Grade[] | null = null;
  filteredGrades: Grade[] = [];
  searchQuery: string = '';

  filters: Filters = {
    education: {
      formal: [],
      self: []
    },
    experience: {
      total: [],
      teamSize: []
    },
    hardSkills: [],
    softSkills: [],
    projectSkills: []
  };

  // Options for filters
  educationOptions: string[] = [];
  experienceOptions: string[] = [];
  teamSizeOptions: string[] = [];
  hardSkillsOptions: string[] = [];
  softSkillsOptions: string[] = [];
  projectSkillsOptions: string[] = [];

  ngOnInit() {
    this.initializeFilterOptions();
    this.applyFilters();
  }

  private initializeFilterOptions() {
    if (!this.grades) return;

    // Collect unique values for each filter
    const uniqueValues = {
      formal: new Set<string>(),
      teamSize: new Set<string>(),
      total: new Set<string>(),
      hardSkills: new Set<string>(),
      softSkills: new Set<string>(),
      projectSkills: new Set<string>()
    };

    this.grades.forEach(grade => {
      if (grade.education?.formal) uniqueValues.formal.add(grade.education.formal);
      if (grade.experience?.teamSize) uniqueValues.teamSize.add(grade.experience.teamSize);
      if (grade.experience?.total) uniqueValues.total.add(grade.experience.total);
      
      if (grade.hardSkills) {
        Array.from(grade.hardSkills.keys()).forEach(skill => uniqueValues.hardSkills.add(skill));
      }
      if (grade.softSkills) {
        Array.from(grade.softSkills.keys()).forEach(skill => uniqueValues.softSkills.add(skill));
      }
      if (grade.projectSkills) {
        Array.from(grade.projectSkills.keys()).forEach(skill => uniqueValues.projectSkills.add(skill));
      }
    });

    // Convert Sets to arrays
    this.educationOptions = Array.from(uniqueValues.formal);
    this.teamSizeOptions = Array.from(uniqueValues.teamSize);
    this.experienceOptions = Array.from(uniqueValues.total);
    this.hardSkillsOptions = Array.from(uniqueValues.hardSkills);
    this.softSkillsOptions = Array.from(uniqueValues.softSkills);
    this.projectSkillsOptions = Array.from(uniqueValues.projectSkills);
  }

  applyFilters() {
    if (!this.grades) return;

    this.filteredGrades = this.grades.filter(grade => {
      // Search by name
      if (this.searchQuery && !grade.name.toLowerCase().includes(this.searchQuery.toLowerCase())) {
        return false;
      }

      // Education filters
      if (this.filters.education.formal.length > 0 && 
          !this.filters.education.formal.includes(grade.education?.formal)) {
        return false;
      }

      // Experience filters
      if (this.filters.experience.total.length > 0 && 
          !this.filters.experience.total.includes(grade.experience?.total)) {
        return false;
      }

      if (this.filters.experience.teamSize.length > 0 && 
          !this.filters.experience.teamSize.includes(grade.experience?.teamSize)) {
        return false;
      }

      // Skills filters
      if (this.filters.hardSkills.length > 0 && 
          !this.filters.hardSkills.some(skill => grade.hardSkills?.has(skill))) {
        return false;
      }

      if (this.filters.softSkills.length > 0 && 
          !this.filters.softSkills.some(skill => grade.softSkills?.has(skill))) {
        return false;
      }

      if (this.filters.projectSkills.length > 0 && 
          !this.filters.projectSkills.some(skill => grade.projectSkills?.has(skill))) {
        return false;
      }

      return true;
    });
  }

  resetFilters() {
    this.searchQuery = '';
    this.filters = {
      education: {
        formal: [],
        self: []
      },
      experience: {
        total: [],
        teamSize: []
      },
      hardSkills: [],
      softSkills: [],
      projectSkills: []
    };
    this.applyFilters();
  }

  openGradeInfo(grade: Grade) {
    this.dialog.open(GradeInfoComponent, {
      data: grade,
    });
  }
}
