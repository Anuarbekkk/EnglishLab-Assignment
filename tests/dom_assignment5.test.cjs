const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');
class Classes {
  constructor(){this.values=new Set();}
  add(s){this.values.add(s);} remove(s){this.values.delete(s);} contains(s){return this.values.has(s);}
  toggle(s,force){const flag=force===undefined?!this.values.has(s):force;flag?this.values.add(s):this.values.delete(s);return flag;}
}
class Element {
  constructor(id=''){this.id=id;this.dataset={};this.style={};this.classList=new Classes();this.listeners={};this.attributes={};this.children=[];this.textContent='';this.value='';this.hidden=false;this.disabled=false;this.checked=false;this.offsetWidth=120;this.inert=false;}
  addEventListener(name,fn){(this.listeners[name] ||= []).push(fn);}
  click(){for(const fn of (this.listeners.click || []))fn({target:this,preventDefault(){}});}
  change(){for(const fn of (this.listeners.change || []))fn({target:this,preventDefault(){}});}
  focus(){doc.activeElement=this;}
  setAttribute(n,v){this.attributes[n]=String(v);if(n==='src')this.src=v;if(n==='alt')this.alt=v;}
  getAttribute(n){return this.attributes[n]??null;}
  append(...els){this.children.push(...els);}
  replaceChildren(...els){this.children=els;}
  scrollIntoView(){}
  querySelectorAll(selector){if(selector==='.a5-step')return steps;return [];}
  querySelector(selector){if(selector.includes('studyGoal')&&selector.includes(':checked'))return choices.goal.checked?choices.goal:null;if(selector.includes('studyLevel')&&selector.includes(':checked'))return choices.level.checked?choices.level:null;if(selector.includes('studyGoal'))return choices.goal;return null;}
  reset(){choices.goal.checked=false;choices.level.checked=false;nodes.a5StudyMinutes.value='20';}
}
const nodes={};
for(const id of ['a5LessonGrid','a5LessonsCount','a5FilterCount','a5CategoryDescription','a5LessonFeedback','a5LessonTip','a5TipTitle','a5TipText','a5PreviewImage','a5PreviewCaption','a5PreviewFrame','a5RatingMessage','a5InstantMessage','a5TimeButton','a5SoundButton','a5SoundToggle','a5ThemeToggle','a5PlannerForm','a5BackButton','a5NextButton','a5PlannerError','a5StepLabel','a5ProgressTrack','a5ProgressFill','a5PlanResult','a5PlanSummary','a5RestartButton','a5StudyMinutes'])nodes[id]=new Element(id);
const filters=['all','grammar','vocabulary','reading','speaking'].map(c=>Object.assign(new Element(),{dataset:{category:c}}));
const thumbs=['grammar','vocabulary','reading','speaking'].map(c=>Object.assign(new Element(),{dataset:{image:'images/slide-'+c+'.svg',alt:c+' alt',caption:c+' caption'}}));
const stars=[1,2,3,4,5].map(n=>Object.assign(new Element(),{dataset:{rating:String(n)}}));
const steps=[0,1,2].map(n=>Object.assign(new Element(),{dataset:{step:String(n)}}));
const choices={goal:Object.assign(new Element(),{value:'Grammar'}),level:Object.assign(new Element(),{value:'Intermediate'})};
const nav=['index.html','tests.html','learn.html'].map(path=>Object.assign(new Element(),{attributes:{href:path}}));
const lab=new Element();nodes.a5StudyMinutes.value='20';
const doc={activeElement:null,getElementById:(id)=>nodes[id]??null,createElement:()=>new Element(),querySelector:(q)=>q==='.a5-lab'?lab:null,querySelectorAll:(q)=>{
 if(q.includes('.navbar-nav'))return nav;
 if(q==='.a5-filter')return filters;
 if(q==='.a5-thumbnail')return thumbs;
 if(q==='#a5RatingStars .a5-star')return stars;
 return [];
}};
const context=vm.createContext({document:doc,window:{matchMedia:()=>({matches:true}),setTimeout:(fn)=>{fn();return 1;},clearTimeout(){},AudioContext:null},performance:{now:()=>1000},console,Date,setTimeout});
vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'js', 'assignment5.js'),'utf8'),context);
let tests=0;function check(v,msg){assert(v,msg);tests++;}
check(nodes.a5LessonGrid.children.length===8,'all lessons rendered');
filters[1].click();check(nodes.a5LessonGrid.children.length===2,'grammar filtering');
check(nodes.a5FilterCount.textContent==='2 lessons','count');
check(nodes.a5CategoryDescription.textContent.includes('sentence patterns'),'switch statement');
filters[0].click();check(nodes.a5LessonGrid.children.length===8,'reset filter');
thumbs[3].click();check(nodes.a5PreviewImage.getAttribute('src').includes('speaking'),'gallery src');
check(nodes.a5PreviewCaption.textContent==='speaking caption','gallery caption');
stars[3].click();check(stars.filter(s=>s.classList.contains('is-active')).length===4,'4 stars');
check(nodes.a5RatingMessage.textContent.includes('4/5'),'rating feedback');
nodes.a5ThemeToggle.click();check(lab.classList.contains('a5-day'),'day theme');
nodes.a5ThemeToggle.click();check(!lab.classList.contains('a5-day'),'night theme');
nodes.a5SoundToggle.click();check(nodes.a5SoundToggle.getAttribute('aria-pressed')==='true','sound enabled');
nodes.a5TimeButton.click();check(nodes.a5InstantMessage.textContent.includes('Current local time:'),'time action');
nodes.a5NextButton.click();check(nodes.a5PlannerError.textContent.includes('Choose a study goal'),'goal required');
choices.goal.checked=true;nodes.a5NextButton.click();check(nodes.a5StepLabel.textContent.includes('Step 2'),'step 2');
nodes.a5BackButton.click();check(choices.goal.checked,'back retains form state');
nodes.a5NextButton.click();choices.level.checked=true;nodes.a5NextButton.click();check(nodes.a5StepLabel.textContent.includes('Step 3'),'step 3');
nodes.a5StudyMinutes.value='7';nodes.a5NextButton.click();check(nodes.a5PlannerError.textContent.includes('10–90'),'minutes validation');
nodes.a5StudyMinutes.value='30';nodes.a5NextButton.click();check(nodes.a5PlanResult.hidden===false,'result shown');
check(nodes.a5PlanSummary.textContent.includes('30 minutes'),'summary content');
nodes.a5RestartButton.click();check(nodes.a5PlanResult.hidden===true&&nodes.a5StepLabel.textContent.includes('Step 1'),'reset planner');
nav[0].focus();for(const fn of nav[0].listeners.keydown)fn({key:'ArrowRight',preventDefault(){}});check(doc.activeElement===nav[1],'keyboard arrow');
for(const fn of nav[1].listeners.keydown)fn({key:'End',preventDefault(){}});check(doc.activeElement===nav[2],'keyboard end');
check(vm.runInContext('practiceLessons.totalMinutes()',context)===86,'catalog method');
console.log(`PASS: ${tests} JavaScript DOM tests`);
