const Targeting = Vue.createApp({
    data() {
        return {
            Show: false,
            ChangeTextIconColor: false, // This is if you want to change the color of the icon next to the option text with the text color
            StandardEyeIcon: 'https://media.discordapp.net/attachments/1001133419473944596/1033778567181516911/nbj.png', // Instead of icon it's using a image source found in HTML 
            CurrentIcon: 'https://media.discordapp.net/attachments/1001133419473944596/1033778567181516911/nbj.png', // Instead of icon it's using a image source found in HTML
            SuccessIcon: 'https://media.discordapp.net/attachments/1001133419473944596/1033778566745301004/sdasda.png', // Instead of icon it's using a image source found in HTML
            SuccessColor: "rgb(240, 87, 14)",
            StandardColor: "white",
            TargetHTML: "",
            TargetEyeStyleObject: {
                color: "white", // This is the standardcolor, change this to the same as the StandardColor if you have changed it
            },
        }
    },
    destroyed() {
        window.removeEventListener("message", this.messageListener);
        window.removeEventListener("mousedown", this.mouseListener);
        window.removeEventListener("keydown", this.keyListener);
    },
    mounted() {
        this.messageListener = window.addEventListener("message", (event) => {
            switch (event.data.response) {
                case "openTarget":
                    this.OpenTarget();
                    break;
                case "closeTarget":
                    this.CloseTarget();
                    break;
                case "foundTarget":
                    this.FoundTarget(event.data);
                    break;
                case "validTarget":
                    this.ValidTarget(event.data);
                    break;
                case "leftTarget":
                    this.LeftTarget();
                    break;
            }
        });

        this.mouseListener = window.addEventListener("mousedown", (event) => {
            let element = event.target;
            let split = element.id.split("-");
            if (split[0] === 'target' && split[1] !== 'eye') {
                $.post(`https://${GetParentResourceName()}/selectTarget`, JSON.stringify(Number(split[1]) + 1));
                this.TargetHTML = "";
                this.Show = false;
            }

            if (event.button == 2) {
                this.CloseTarget();
                $.post(`https://${GetParentResourceName()}/closeTarget`);
            }
        });

        this.keyListener = window.addEventListener("keydown", (event) => {
            if (event.key == 'Escape' || event.key == 'Backspace') {
                this.CloseTarget();
                $.post(`https://${GetParentResourceName()}/closeTarget`);
            }
        });
    },
    methods: {
        OpenTarget() {
            this.TargetHTML = "";
            this.Show = true;
            this.TargetEyeStyleObject.color = this.StandardColor;
        },

        CloseTarget() {
            this.TargetHTML = "";
            this.TargetEyeStyleObject.color = this.StandardColor;
            this.Show = false;
            this.CurrentIcon = this.StandardEyeIcon;
        },

        FoundTarget(item) {
            if (item.data) {
                //this.CurrentIcon = item.data;
                this.CurrentIcon = this.SuccessIcon;
            } else {
                this.CurrentIcon = this.SuccessIcon;
            }
            this.TargetEyeStyleObject.color = this.SuccessColor;
        },

        ValidTarget(item) {
            this.TargetHTML = "";
            let TargetLabel = this.TargetHTML;
            const FoundColor = this.SuccessColor;
            const ResetColor = this.StandardColor;
            const AlsoChangeTextIconColor = this.ChangeTextIconColor;
            item.data.forEach(function(item, index) {
                if (AlsoChangeTextIconColor) {
                    TargetLabel += "<div id='target-" + index + "' style='background-color: #00000090; background-position:-50%; padding: .35vh; padding-bottom: 0.4vh; padding-left: 1.75vh; padding-right: 1.75vh; margin-bottom: 1vh; margin-left: 0vh; margin-right: .5vh; border-radius: 1vh; '><span id='target-icon-" + index + "' style='color: " + ResetColor + "'><i class='" + item.icon + "'></i></span>&nbsp" + item.label + "</div>";
                } else {
                    TargetLabel += "<div id='target-" + index + "' style='background-color: #00000090; background-position: -50%; padding: .35vh; padding-bottom: 0.4vh; padding-left: 1.75vh; padding-right: 1.75vh;margin-bottom: 1vh; margin-left: 0vh; margin-right: .5vh; border-radius: 1vh; '><span id='target-icon-" + index + "' style='color: " + FoundColor + "'><i class='" + item.icon + "'></i></span>&nbsp" + item.label + "</div>";
                };

                setTimeout(function() {
                    const hoverelem = document.getElementById("target-" + index);

                    hoverelem.addEventListener("mouseenter", function(event) {
                        event.target.style.color = FoundColor;
                        if (AlsoChangeTextIconColor) {
                            document.getElementById("target-icon-" + index).style.color = FoundColor;
                        };
                    });

                    hoverelem.addEventListener("mouseleave", function(event) {
                        event.target.style.color = ResetColor;
                        if (AlsoChangeTextIconColor) {
                            document.getElementById("target-icon-" + index).style.color = ResetColor;
                        };
                    });
                }, 10)
            });
            this.TargetHTML = TargetLabel;
        },

        LeftTarget() {
            this.TargetHTML = "";
            this.CurrentIcon = this.StandardEyeIcon;
            this.TargetEyeStyleObject.color = this.StandardColor;
        }
    }
});

Targeting.use(Quasar, {
    config: {
        loadingBar: { skipHijack: true }
    }
});
Targeting.mount("#target-wrapper");


// function main(){
//     return {
//         display: false,
//         eyeActive: false,
//         target: [],
//         executeTarget(id){
//             if(this.target[id]){
//                 postData(`selectTarget`, id + 1).then(data => {
//                     if (data.status == 'success') {
//                         this.display = false;
//                     }
//                 })
//             }
//         },
        
//         listen(){
//             window.addEventListener('message', (event) => {
//                 const item = event.data
//                 switch (item.response) {
//                     case 'validTarget':
//                         this.target.splice(0, this.target.length);
//                         for (let [index, itemData] of Object.entries(item.data)) {
//                             if (itemData !== null) {
//                                 this.target.push(itemData)
//                             }
//                           }
//                         this.eyeActive = true;
//                         break;
//                     case 'openTarget':
//                         this.display = true;
//                         break;
//                     case 'closeTarget':
//                         this.display = false;
//                         this.eyeActive = false;
//                         this.target.splice(0, this.target.length);
//                         break;
//                     case 'leftTarget':
//                         this.eyeActive = false;
//                         this.target.splice(0, this.target.length);
//                         break
//                 }
//             })
//         }
//     }
// }

// async function postData(event = '', data = {}) {
//     const response = await fetch(`https://${GetParentResourceName()}/${event}`, {
//       method: 'POST', // *GET, POST, PUT, DELETE, etc.
//       mode: 'cors', // no-cors, *cors, same-origin
//       cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
//       credentials: 'same-origin', // include, *same-origin, omit
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       redirect: 'follow',
//       referrerPolicy: 'no-referrer',
//       body: JSON.stringify(data)
//     });
//     return response.json();
//   }
