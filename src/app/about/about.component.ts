import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

declare var $: any;

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  modalRef: BsModalRef;
  leader: any = {};
  leaders = [];
  directors = [];
  members = [{
    name: 'Harshit Jain',
    pic: './assets/images/leaders/harshit.png',
    cat: 'A',
    intro:'With deep-rooted knowledge, he is our true Principal',
    designation: 'CEO & Principal Officer',
    desc: `If Leadership can be defined by a certain team member’s capability to transform visions into reality with deep-rooted knowledge on the subject, then our ‘Principal’ PO & CEO, Harshit Jain, can stand as the living definition of a ‘leader’. Our Principal is literally the Principal Officer of Trinity Reinsurance Brokers Limited, as that explains the inception of that name. Having completed his fellowship from Insurance institute of India, an MBA in Insurance and 15 years of handling the direct & retail segments of business, matters of Insurance is now genuinely his ‘Beyein hat ka khel!’`
  }, {
    name: 'Akhilesh Jain',
    pic: './assets/images/leaders/akhilesh.png',
    cat: 'A',
    intro:'With a deep-dug experience he is, the ‘Iron-Man’ of our crew',
    designation: 'Vice Chairman',
    desc: `With his 15 years of experience in both the insurance and re-insurance industries, we need not
        explain the reason behind his name. With a deep-dug experience in the managing sector of
        Insurance & Brokerage business, he is our know-it-all person of the crew. Having completed his
        postgrads in Management & his studies on International Business from the University of
        Birmingham, England, it’s his technical and marketing expertise that literally makes him the
        trademarked ‘Iron-Man’ of our crew.`
  }, {
    name: 'Chetan Vasudeva',
    pic: './assets/images/leaders/chetan.png',
    cat: 'B',
    intro:'His die-hard attitude makes him the Phantom of ThePolicyMall',
    designation: 'VP & Head-Retail Business',
    desc: 'Remember the Diamond Comics Superhero ‘Phantom’ who never died? Well we do have a Phantom on floor as well. With over 20 years of experience of spending days in the deepest layers of the Finance jungle, his business acumen and die-hard attitude is what makes him the superhero Phantom of The Policy Mall. Having worked at a plethora of Insurance Companies and brokerage organizations, his experience on Insurance is a multidimensional resource for our team, while his brilliant field-knowledge of channel distribution just makes us call him the Phantom, whose expertise can never die.'
  }, {
    name: 'Vikas Sunil Srivastava',
    pic: './assets/images/leaders/vss.png',
    cat: 'B',
    intro:'The He-Man on the floor who never puts his Power-sword down.',
    designation: 'Asst. Vice President - Digital Business',
    desc: `Having graduated from the Delhi University in the year 2006, Vikas Sunil Srivastava, set out on the
      way to explore the world of Insurance. Initially having a joined as a Team Leader in a competitive
      peer firm of The Policy Mall, he began sharpening his sword of finance. Over the period of last
      twelve years his work-ex in several reputed insurance and re-insurance firms of India, makes him our
      He-Man on floor and his power-sword being his work-ex. In the tenure of one year of having worked
      together, we are yet to find a query related to Insurance that our He-Man could not slash down with
      his Power-sword. Amen.`
  }];

  constructor(private modalService: BsModalService) { }

  ngOnInit() {
    this.leaders = this.members.filter(e=>e.cat == 'B');
    this.directors = this.members.filter(e=>e.cat == 'A');
    $("html, body").animate({ scrollTop: 0 }, 600);

    setTimeout(() => {
      $('.carousel-leaders').owlCarousel({
        loop: true,
        margin: 10,
        nav: true,
        autoplay: false,
        dots: false,
        responsive: {
          0: {
            items: 1
          },
          600: {
            items: 1
          },
          1000: {
            items: 2
          }
        }
      });

      $('.carousel-directors').owlCarousel({
        loop: true,
        autoplay: false,
        margin: 10,
        nav: true,
        dots: false,
        responsive: {
          0: {
            items: 1
          },
          600: {
            items: 1
          },
          1000: {
            items: 2
          }
        }
      })
    }, 100);

    
    // $('.carousel-awards').owlCarousel({
    //   loop: true,
    //   margin: 20,
    //   autoplay: true,
    //   nav: true,
    //   dots: false,
    //   responsive: {
    //     0: {
    //       items: 2
    //     },
    //     600: {
    //       items: 2
    //     },
    //     1000: {
    //       items: 4
    //     }
    //   }
    // })
   

  }

  openModal(template: TemplateRef<any>, leader) {
    this.leader = leader;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg common-popup' });
  }

}
