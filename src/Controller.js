export default class Controller {
    constructor(changeTitleFn) {
        this.sceneText = '';
        this.choices = [];
        this.oldText = [];
        this.changeTitleFn = changeTitleFn;
        this._entry();
    }

    clear() {
        this.oldText.push(this.sceneText);
        this.sceneText = '';
        this.choices = [];
    }

    title(ti) {
        this.sceneTitle = ti;
        this.changeTitleFn(ti);
    }

    text(str) {
        this.sceneText += str;
    }

    allow(handlerFn, text, doNotClear) {
        this.choices.push({
            handler: () => {
                if (!doNotClear) {
                    this.clear();
                }
                handlerFn.call(this);
            },
            text,
        });
    }

    _restart() {
        this.clear();
        this.oldText = [];
        this.lookedAtMirror = false;
        this.ropesCast = false;
        this.bookRead = false;
        this.noteRead = false;
        this.curtainsOpened = false;
        this.touchDiscovered = false;
        this.suicideAttempted = false;
        this.relocated = false;
        this.dumbleMet = false;
        this.drawWandTooLate = false;
        this.glovesRemoved = false;
        this.beenToDark = false;
        this.beenToOffice = false;
        this.defied = false;
        this._entry();
    }

    _entry() {
        this.title('Diagon Alley');
        this.text(`
        You walk along the bustling Diagon Alley. This is not your first time here, but due to the current
        circumstances, you can't help but be nervous. Why? Someone is after you, but you cannot remember who.
        <br/><br/>
        Your eyes meet the dark windows of the Leaky Cauldron. You suddenly feel very thirsty.
        `);
        this.allow(this._walkAlong, 'Walk along. It is too risky to stay.');
        this.allow(this._getDrink, 'Go inside the Leaky Cauldron. You need a drink.');
    }

    _walkAlong() {
        this.title('Diagon Alley');
        this.text(`
        A voice at the back of your head tells you that you deserve some rest, and that you should be
        expecting a certain someone. You nod in agreement, though you have no idea who that someone is.
        `);
        this.allow(this._getDrink, 'You turn and walk into the pub.');
        this.allow(this._getDrink, 'You can\'t help but turn and walk into the pub.');
    }

    _getDrink() {
        this.title('The Leaky Cauldron');
        this.text(`
        You are inside the Leaky Cauldron. The light is dim in here, and people are chattering. Nobody seems to notice
        you.
        <br/><br/>
        You walk up to the old bartender.        
        `);
        this.allow(this._order.bind(this, 'beer'), 'Order beer');
        this.allow(this._order.bind(this, 'cola'), 'Order Coca-Cola');
        this.allow(this._order.bind(this, 'Sherry'), 'Order Sherry');
        this.allow(this._order.bind(this, 'milk'), 'Order warm milk');
    }

    _order(drink) {
        let text;
        switch (drink) {
            case 'cola':
                text = `"...What?" The bartender does not seem to understand your request.`;
                break;
            case 'milk':
                text = `The bartender is a bit surprised by your request. But after a while, he hands you a warm glass
                    of milk. You remove your gloves as you drink it and feel warmer.
                `;
                this.glovesRemoved = true;
                break;
            default:
                text = `The bartender hands you a glass of ${drink}. You take a few gulps and are no longer thirsty.`;
                break;
        }
        this.text(`
        ${text}
        <br/>You suddenly hear a commotion behind you.
        `);
        this.allow(this._ignoreCommotion, 'Ignore');
        this.allow(this._investigateCommotion, 'Investigate');
    }

    _investigateCommotion() {
        this.text(`
        Against your better judgements, you walk toward the source of the commotion, where a small
        crowd has already gathered. You raise your head and see a giant of a man who you recognize as Hagrid.
        You look down and see a boy with a lightning-shaped scar on his forehead... Harry Potter! You 
        involuntarily recoil in fear.
        <br/><br/>
        But everyone is distracted. This is a great opportunity.
        `);
        this.allow(this._fleeFromPotter, 'Flee');
        this.allow(this._greetPotter, 'Greet Potter');
        this.allow(this._drawWand, 'Draw wand');
    }

    _ignoreCommotion() {
        this.text(`
        You sit still. But soon your ears catch a name -- but it can't be... You turn around and see him, the
        Boy Who Lived. You shiver.
        <br/><br/>
        You need to make a choice.
        `);
        this.allow(this._fleeFromPotter, 'Flee');
        this.allow(this._greetPotter, 'Greet Potter');
        this.allow(this._drawWand, 'Draw wand');
    }

    _fleeFromPotter() {
        this.text(`
        You haste to leave as fast as possible. But Hagrid catches you. Curse that giant halfwit! Should have finished
        the job years before.
        <br/><br/>
        "Professor Quirrell!" Hagrid says. "Harry, Professor Quirrell will be one of your teachers at Hogwarts."
        `);
        this._greetPotter();
    }

    _greetPotter() {
        this.text(`
           You stutter to tell Potter how pleased you are to meet him. Potter asks you a few questions, and you make
           up a reason for why you are here.
           <br/><br/>
           Something in the back of your head tells you that this is an opportunity you cannot afford to lose.
        `);
        this.drawWandTooLate = true;
        this.allow(this._shakeHands, 'Shake hands');
        this.allow(this._drawWand, 'Draw wand');
    }

    _drawWand() {
        if (this.drawWandTooLate) {
            this.text(`
            But it is too late. Guests rush around you to greet Potter and your wand is knocked out of
            your hand. You pick up your wand, but Potter is already surrounded by people. You think to yourself
            that you should have decided sooner.
            <br/><br/>
            `);
            this._fleeForReal();
        } else {
            this.title('Ending #1');
            this.text(`
                You draw out your wand, and a frenzy of thoughts assault you. You want to back down, but it is too late.
                Voldemort's will completely overcomes yours. You raise your wand.
                <br/><br/>
                A raspy voice shouts out "Avada Kedavra!". A green light emerges from the tip of
                your wand and connects with Potter. He drops to the ground and dies with his eyes open.
                <br/><br/>
                You are quickly subdued by the crowd. Though you are sentenced
                to die months later, your destiny has been fulfilled. Doom and despair descends upon the wizarding world.
                <br/><br/>
                But does it really matter? You rot six feet below the ground.
            `);
            this.allow(this._restart, 'Restart');
        }
    }

    _shakeHands() {
        this.text(`You take a step forward to shake Potter's hand.<br/><br/>`);
        if (this.glovesRemoved) {
            this.touchDiscovered = true;
            this.text(
                `
                To your horror, you feel as if your flesh on your hands is melted away as you touch Potter's
                hands. You shriek and jump back.
                <br/><br/>
                Potter and Hagrid are startled, but they are soon overwhelmed by the people swarming to greet them.
                As people rush over you, you see smoke rising from your right hand. You quickly put on your gloves,
                and the pain subsides slightly.
            `);
        } else {
            this.text(`
            You are soon pushed out of the way by enthusiastic drinkers who want to meet Potter.
            `);
        }
        this.text('<br/><br/>');
        this._fleeForReal();
    }

    _fleeForReal() {
        this.title('Diagon Alley');
        this.text(`You walk out of the Leaky Cauldron and regain your breath. You quickly exit the area.`);
        this.allow(this._theOffice, 'Continue');
    }

    _theOffice() {
        this.title('Professor Quirrell\'s office');
        if (!this.beenToOffice) {
            this.beenToOffice = true;
            this.text('<strong>A few weeks later later...</strong>');
            if (this.touchDiscovered) {
                this.text('<br/>The blisters on your hands have left a scar.')
            }
            this.text('<br/><br/>');
        }
        if (this.curtainsOpened) {
            this.text(`
                You are inside a brightly lit office. Books are scattered across the desk and on the ground. Everything
                is a mess.
            `);
        } else {
            this.text(`
                You are sitting in a dark room, in front of a large desk. You can barely see books scattered across the desk.
                
                Today is a big day... for something. You fail to remember, as the presence
                that grows at the back of your head seems to confuse your mind.
            `);
        }

        this.allow(() => {
            if (this.curtainsOpened) {
                if (!this.bookRead) {
                    this.text('<br/><br/> The only thing of note is a large, dirty book sticking out of the bookshelf.');
                    this.allow(this._takeBook, 'Take book');
                } else {
                    this.text('<br/><br/> The room is very messy.');
                }
            } else {
                this.text('<br/><br/> You cannot see anything besides your desk, as it is too dark.');
            }
        }, 'Look around', true);
        this.allow(this._exitOffice, 'Exit office');
        if (!this.curtainsOpened)
            this.allow(this._openCurtains, 'Open curtains');
    }

    _openCurtains() {
        this.title('Professor Quirrell\'s office');
        this.curtainsOpened = true;
        this.text(`
        Sunlight pours into the room. Outside, you see students walking in groups and holding small flags of their
        houses. You remember now -- it is Quidditch day, and you have a task to perform.
        <br/><br/>
        `);
        this._theOffice();
    }

    _takeBook() {
        this.text(`You take the book. The cover reads <i>Deliciously Insidious Spells to use for Covert Purposes</i>.
            A dirty yellow bookmark sticks out of the pages.
        `);
        this.allow(this._readBook, 'Read book');
        this.allow(this._exitOffice, 'Exit office');
    }

    _readBook() {
        this.bookRead = true;
        this.text(`
        You flip the book to the location of the bookmark and read it. The page seems to be dedicated to incantations
        that make magical appliances, such as broomsticks, go out of control.
        <br/><br/>"Yes. I almost forgot..." The Dark Lord whispers from behind your head.
        <br/><br/>You memorize the spell again and close the book.
        `);
        this.allow(this._exitOffice, 'Exit office');
    }

    _exitOffice() {
        this.title('Offices hallway');
        this.text(`
        You are inside a dark hallway that runs North-South. Around you are a few offices, all of which are locked
        except yours.
        <br/><br/>To the West is your office.
        <br/><br/>You see some light to the North.
        `);
        this.allow(this._roundJunction, 'Go North');
        this.allow(this._theOffice, 'Go West');
        this.allow(this._nextToMirror, 'Go South');
    }

    _roundJunction() {
        this.title('Round Junction');
        this.text(`
            You are at a round junction, ornately decorated.
            <br/><br/>To the North is an exit of the castle.
            <br/><br/>A set of stairs leads upward to the West.
            <br/><br/>To the East is a dark hallway leading god knows where. You seem to see a glint in the dark.
        `);
        this.allow(this._darkHallway, 'Go East');
        this.allow(this._exitOffice, 'Go South');
        this.allow(this._tower, 'Go West');
        this.allow(this._pathToQuidditch, 'Go North');
    }

    _darkHallway() {
        this.title('Dark Hallway');
        if (!this.beenToDark) {
            this.beenToDark = true;
            this.text(`
            As the light behind you fades away, you seem to feel a bit numb. You hear footsteps hurrying away from
            you into the dark. There is a piece of paper on the ground.
            `);
            this.allow(this._readNote, 'Read paper');
            this.allow(this._roundJunction, 'Go West');
            this.allow(this._meetDumbledore, 'Go East');
        } else {
            this.text('A brick wall stands in front of you. There is nowhere to go but West.');
            this.allow(this._roundJunction, 'Go West');
        }
    }

    _readNote() {
        if (!this.noteRead) {
            this.noteRead = true;
            this.text(`
            In the dark, you barely make out the words on the pristine white paper.<br/><br/>
            It reads:
            <h2>Human Observation Ground With Artificially Reproduced Tests, a Simulation</h2>
            <h3>Dumbledore, Albus. Ph.D.</h3>
            <h3>September 2033</h3>
            <p>
            The simulation had been going smoothly since the opening feast. I do, however, project that the 
            graphical rendering unit to sustain moderate to major strain when Quidditch season begins, as it does
            require the machine to render up to thousands of living entities. For this reason, I have rented a few
            stand-by units, graphical and arithmetic (for the AI), from AWS. Adam has also been doing a great job
            monitoring the activities of the Trojan-inspired virus we so lovingly call Vo...
            </p>
            At this point your head starts hurting unbearably, and you drop the paper.
            <br/><br/>
            There is light to the West.
            <br/><br/>
            To the East, you cannot see anything.
         `);
        } else {
            this.text(`
            A piece of paper lies on the ground, but you do not wish to pick it up.
            <br/><br/>
            There is light to the West.
            <br/><br/>
            To the East, you cannot see anything.
            `);
        }
        this.allow(this._readNote, 'Read Note');
        this.allow(this._meetDumbledore, 'Go East');
        this.allow(this._roundJunction, 'Go West');
    }

    _meetDumbledore() {
        if (this.noteRead) {
            this.dumbleMet = true;
            this.text(`
                A face emerges from the dark. It is Albus Dumbledore. You stare at him, unable to move. He smiles
                and says: "He has corrupted too many of your core files. The only way out now is a clean re-install."
                Without casting a spell, he vanishes.
                <br/><br/>
                You blink, and the dark hallway in front of you turns to a brick wall.
        `);
        } else {
            this.text(`
            There is nothing beyond the dark hallway. Nevertheless, you try to move East. You are suddenly transported
            back.
            <br/>
            <h4 style="background-color: black; color: white;"><code>Read Error</code></h4> a line of white text appears in front of you out of thin air.
            `);
            this.allow(this._meetDumbledore, 'Go East');
        }
        this.allow(this._readNote, 'Read Note');
        this.allow(this._roundJunction, 'Go West');
    }

    _tower() {
        this.title('Hanging Walkway');
        this.suicideAttempted = true;
        this.text(`
        You are now high above the ground on an outdoors walkway. To the West is a locked door of a tower.
        To the East is a stairway leading down.
         `);
        this.allow(() => {
            this.text('The door is locked!<br/><br/>');
            this._tower();
        }, 'Go West');
        this.allow(this._roundJunction, 'Go East');
        this.allow(this._jumpDown, 'Go North');
    }

    _jumpDown() {
        this.text(`
            You peer down onto the ground from the walkway, a thirty feet drop.
           "What are you trying to do?" the voice questions you from the back of your head. "You know that I could see
           all your intents, and that I would never let you die, right?"
           <br/>
           The voice says again: "Get the stone, Quirrell. This will not happen a second time."
           <br/><br/> 
           You involuntarily take a step back.
        `);
        this.allow(() => {
            this.text('The door is locked!<br/><br/>');
            this._tower();
        }, 'Go West');
        this.allow(this._roundJunction, 'Go East');
        this.allow(this._jumpDown, 'Go North');
    }

    _nextToMirror() {
        if (this.lookedAtMirror) {
            this.title('Classroom hallway');
            this.text(`
                The Mirror of Erised that was previously here is now gone. You suspect that someone is behind this.
                <br/><br/>
                To the South are classrooms. However, going there would be going the opposite direction of where
                you should be going.
            `)
        } else {
            this.title('The Mirror of Erised');
            this.text(`
            Astoundingly, a mirror stands in the middle of the hallway. You recognize it as the Mirror of Erised.
            <br/><br/>
            There is light to the North.
            <br/><br/>
            To the South are classrooms. For some reason, you do not wish to go there.
        `);
            this.allow(this._lookAtMirror, 'Look at Mirror');
        }
        this.allow(this._exitOffice, 'Go North');
    }

    _lookAtMirror() {
        this.lookedAtMirror = true;
        this.text(`
            "What do you see?" The parasite at the back of your head questions.
        `);
        this.allow(this._afterMirror.bind(this, 'respect'), `"That I are presenting the Stone to you my Lord, and Harry Potter
        lies dead beside you."`);
        this.allow(this._afterMirror.bind(this, 'defy'), '"That I am being presented an award for defeating you, my lord."');
        this.allow(this._afterMirror.bind(this, 'flatter'), `"That you rule over the world, master, and millions,
        nay, billions of people kneel before you, master. And of course you sit on a golden throne."`);
        this.allow(this._afterMirror.bind(this, 'humor'), `
        "That, erm... , that I am enjoying a bucket of chicken wings. I do very much enjoy chicken wings my Lord."
        `);
        if (this.dumbleMet) {
            this.allow(this._afterMirror.bind(this, 'code'), `
            "A series of words, my lord: 'Buffer Overflow' I know not what that means."
            `);
        }
    }

    _afterMirror(what) {
        switch (what) {
            case 'respect':
                this.text(`"Good, good." the Dark Lord replies. "I am glad with your faith, Quirrell."`);
                break;
            case 'flatter':
                this.text(`"You overdid it, Quirrell. Shut up and get a move on." the Dark Lord says angrily, albeit feebly.`);
                break;
            case 'humor':
                this.text("The Dark Lord sighs. He seems to be a little fazed.");
                this.allow(() => {
                    this.text('"Please, Quirrell." The Dark Lord sighs again in defeat. "Just go."');
                    this.allow(this._roundJunction, 'Go North');
                }, "I'm sorry, my lord. Are you a vegan? I never asked...");
                break;
            case 'defy':
                this.defied = true;
                this.text(`
                "You dare defy me, Quirrell?" The Dark Lord raises his voice. You feel a great deal of pain and drop 
                down onto the ground.
                <br/><br/>
                A while later, you wake up in the same place as before. Cold and shivering. The Mirror is now gone.
                `);
                break;
            case 'code':
                this.text(`The Dark Lord suddenly jerks in fear. "Leave this forsaken place..." He demands.`);
                break;
            default:
                this.text('Oops. Looks like I made an error in my code. I am sorry.');
                break;
        }
        this.allow(this._roundJunction, 'Go North');
    }

    _pathToQuidditch() {
        this.title('Path to Quidditch');
        this.text(`
        You are on a North-South path through the grass.<br/><br/>To the North is the Quidditch stadium.
        <br/><br/>To the South is the castle.
        `);
        this.allow(this._stadium, 'Go North');
        this.allow(this._roundJunction, 'Go South');
    }

    _stadium() {
        this.title('Quidditch Stadium');
        this.text("You are now at the Quidditch stadium. Hundreds of students have already arrived.");
        this.allow(this._quidditchStand, 'Walk to stand');
        this.allow(this._pathToQuidditch, 'Go South');
    }

    _quidditchStand() {
        this.title('Quidditch Stand');
        this.text(`
                The game has already begun -- it is Slytherin against Gryffindor. You pull down your turban the
                muffle out the cheers of the crowd around you as you search for Potter.
                <br/><br/>
                There! You have found him, hovering high above the other players. "Do it." The voice whispers from
                behind your head. "Do it now."
            `);
        this.allow(this._chant, 'Chant curse on Potter');
        if (this.defied && this.suicideAttempted && this.bookRead) {
            this.allow(this._sacrifice, 'Chant curse on self');
        }
        this.allow(this._refuseToChant, 'Refuse to chant');
        this.allow(this._relocate, 'Relocate elsewhere');
    }

    _chant() {
        if (this.bookRead) {
            this.text(
                `
                You focus your eyes on Potter and start chanting your curse. His broom soon starts to rebel.
                In a few minutes, the whole crowd has quieted down as Potter's broom starts to lose control.
                The broom jumps higher and higher and it seems that Potter is about to lose his grip...
                <br/><br/>
                `
            );
            if (this.relocated) {
                this.text(`
                And he does. Unfortunately, one of the Weasley twins (you can't tell which) catches Potter on his
                way down. You concentrate your curse now again to the Weasley's broom...
                <br/><br/>
                Your curse, however, is interrupted by a fire. Snape is somehow on fire, and students around him are
                 running around in hysteria. After you have regained focus, it is already too late. After Potter got
                 back onto his broom, he soon scored for the Gryffindors by catching the Snith. The game is over.
                `)
            } else {
                this.text(`
                Suddenly, someone runs into you. You recognize the perpetrator as one of your students, Ms. Granger,
                before you plunge down head-first into the next row.
                <br/><br/>
                After you've struggled to get up, it is already too late. The game is over, and Potter stands safely
                on the ground.
                `);
            }
            this.allow(this._finalChapter, 'Continue');
        } else {
            this.text(`
                You lock your eyes onto Potter. You open your mouth to recite the curse but you realize that you have
                forgotten the spell. You become paralyzed in fear as you recall that you forgot to review it this
                morning.
                <br/><br/>
                "What's the matter, Quirrell?" Voldemort demands.
            `);
            this.allow(this._wrath.bind(this, 'apology'), `"I'm sorry, my Lord... I have forgotten the curse. I bookmarked it in my
            textbook but I forgot to review it this morning."
            `);
            this.allow(this._wrath.bind(this, 'remedy'), `"I've forgotten the curse my Lord. But it is not too late! I
             will retrieve the book right away."
            `);
            this.allow(this._wrath.bind(this, 'lie'), `
            "No problem, my Lord! Just warming up -- let me see... the curse is 'broomus disruptus...' (lie)"
            `);
        }
    }

    _refuseToChant() {
        this.text(`
            "No," you refuse. "I will not murder a young boy just because you are scared of a prophecy."
            <br/>
            "Very well." the Dark Lord replies, "Then I will take it from here."
            <br/>
            You feel your willpower weaken as the Dark Lord takes gradual control of your mind.
        `);
        this.allow(this._chant, 'Chant curse on Potter');
        this.allow(this._chant, 'Chant curse on Potter');
    }

    _sacrifice() {
        this.title('Ending #3');
        this.text(`
            You take a deep breath as the Dark Lord urges you on. 
            <br/><br/>
            "Good, good..." You hear the Dark Lord whisper. "Let the hate flow through you..."
            <br/><br/>
            "I will be your servant no longer, master." You speak out loud.
            A green light flashes as you direct your wand to your chest. Neither you or the Dark Lord
            had time to shout before life exits your body and you tumble down the stand.
            <br/><br/>
            Your act forced Voldemort to find another host while the world is alerted of his presence. The Dark Lord
            is eventually defeated, with less casualties, thanks to your sacrifice.
            <br/><br/>
            Still, some people call you a martyr, while others call you weak. 
        `);
        this.allow(this._restart, 'Restart');
    }

    _wrath(strategy) {
        this.title('Ending #2');
        switch(strategy) {
            case 'apology':
                this.text(`
                "Imbecile!" the Dark Lord curses you from behind. "I have been too lenient with you I see..."
                `);
                break;
            case 'remedy':
                this.text(`
                    "Nonsense!" The Dark Lord retorts. "It is already too late... I should have done this a long time
                    ago."
                `);
                break;
            case 'lie':
                this.text('The Dark Lord almost chuckles. "Take me as a fool do you..."');
                break;
            default:
                this.text("Oops. Seems like I made a mistake. Sorry.");
        }
        this.text(`
            <br/><br/>
            The Dark Lord has finally had it with you.
            <br/><br/>
            You feel as if your body is torn in half as the Dark Lord exits your body. The last thing you see is a
            trail of black smoke drifting away.
            <br/><br/>
            Voldemort finds another host soon later, but he is eventually defeated by Harry Potter and his army.
        `);
        this.allow(this._restart, 'Restart');
    }

    _relocate() {
        this.relocated = true;
        this.text(`
            You move to a higher place in the stands, since you get a eerie feeling that someone will knock you over
            while you are chanting. You look up again and quickly identify Potter, who is still circling around.
        `);
        this.allow(this._chant, 'Chant curse on Potter');
        if (this.defied && this.suicideAttempted && this.bookRead) {
            this.allow(this._sacrifice, 'Chant curse on self');
        }
        this.allow(this._refuseToChant, 'refuse to chant');
    }

    _finalChapter() {
        this.title('The Last Chamber');
        this.text(`
            Another month has passed.
            <br/><br/>
            After weeks and weeks of hard work, you have finally reached the Mirror of Erised, so meticulously 
            protected by the professors, and yet the Dark Lord guided you through the traps. Surprisingly, Potter 
            caught on as well, and he foolishly tried to stop you. You subdued him easily.
            <br/><br/>
            You now stare at yourself in the Mirror of Erised. Potter lies next to you, bound by the ropes you casted.
            <br/><br/>
            You need to find the Sorcerer's Stone, and you know that the Mirror has something to do with it.
            <br/><br/>
            "Use the boy... Use the boy..." The Dark Lord whispers.
        `);
        this.allow(this._useTheBoy, 'Use the boy');
        this.allow(this._breakMirror, 'Break the Mirror');
        this.allow(this._useTheBoy.bind(this, true), 'Kill Potter');
    }

    _useTheBoy(killBoy) {
        if (killBoy) {
            this.text(`
                The Dark Lord detects your thoughts. "What's the matter with you?" Voldemort reproaches. "I need the 
                boy <i>alive</i>."
                <br/>
                You have no choice but to comply.
                <br/><br/>
            `);
        }
        this.text(`
            You unwrap the ropes binding Potter and bring him to the Mirror. You ask him what he sees.
            <br/>
            "That I have won the House Cup for Gryffindor." The boy replies.
            <br/>
            You push him away in frustration, but the Dark Lord demands you to get him back. You are ordered to unwrap
            your turban and let the Dark Lord speak to Potter. You do so.
            <br/><br/>
            As they converse, Potter suddenly springs up and runs for the flame door. "SEIZE HIM!" Voldemort screams.
        `);
        this.allow(this._seizeHim, 'Seize Potter');
        if (this.touchDiscovered) {
            this.allow(this._seizeHim.bind(this, true), 'Put on gloves and seize Potter');
        }
        if (!this.ropesCast)
            this.allow(this._castRopes, 'Cast ropes', true);

        this.allow(this._refuseToSeize, 'Refuse');
    }

    _castRopes() {
        this.ropesCast = true;
        this.text('<br/>In the heat of the moment, you miss the rope.<br/><br/>"I said, SEIZE HIM, YOU FOOL!" The Dark Lord screams yet again.');
    }

    _seizeHim(glovesOn) {
        if (glovesOn) {
            this.text(`
                Remembering the blisters on your hands, you put on your gloves first.
                <br/><br/>
                You grab Potter by the neck and brings him to the ground. You hear something heavy hit the ground,
                and something red and shiny rolls out of Potter's pocket. It is the Sorcerer's Stone.
                <br/><br/>
                "Dumbledore is coming..." The Dark Lord whispers in your ear.
            `);
            this.allow(this._grabStone, 'Grab the Stone');
            this.allow(this._hide, 'Hide');
            this.allow(this._imperio, 'Cast Imperio on Potter');
        } else {
            this.title('Ending #4 (Consistent with book)');
            this.text(`
                You seize Potter, but your hand immediately starts to blister. You shriek and let go.
                <br/>
                You try to seize him again, but you fail as your hands seem to melt away the moment you touch him.
                <br/>
                "Kill him, you fool!" Voldemort screeches.
                <br/>
                You raise your hand, but before you could cast the deadly curse, Potter lunges toward you and grabs your
                face.
                <br/><br/>
                You fight against the pain and raise your wand again. But Dumbledore arrives just in time, and Voldemort
                abandons your body. You expire that instant.
                <br/><br/>
                What happens later is history (in the particular universe described by J.K. Rowling).
            `);
            this.allow(this._restart, 'Restart');
        }
    }

    _refuseToSeize() {
        this.title('Ending #5');
        this.text(`
            "I refuse." You say.
            <br/>
            "Traitor!" The Dark Lord hisses. Knowing that Dumbledore approaches, he escapes, leaving your body behind.
            <br/><br/>
            You die the moment Voldemort exits your body. What happens later is history.
        `);
        this.allow(this._restart, 'Restart');
    }

    _breakMirror() {
        if (this.noteRead) {
            this.title('???');
            this.text(`
                The Mirror shatters into a thousand pieces. As the pieces break apart, you see that they start falling
                more and more slowly to the ground. Your vision begins to get grainy, and you start losing consciousness.
                The last thing you see is a flashing red text on the top-left corner of your vision which reads:
                <br/><br/>
                <code style="color: red;">Warning: dropping below 16 FPS; throttling...</code>
            `);
        } else {
            this.title('Ending #6');
            this.text(`
                "You fool! What have you done?" The Dark Lord cries in desperation. Knowing that it is impossible now
                to retrieve the Stone, he escapes, leaving your body behind.
                <br/><br/>
                You die the moment Voldemort exits your body. What happens later is history.
            `);
        }
        this.allow(this._restart, 'Restart');
    }

    _grabStone() {
        this.title('Ending #7');
        this.text(`
            You sit up to grab the Stone, and you successfully do so. However, as you try to stand up, Potter rolls over
            and grabs your face. Your scream, because your face seems to be melting away like butter.
            <br/><br/>
            Dumbledore arrives in time. Voldemort, fearing retribution, flees and leaves your body behind. You die
            with your hands clutching the Stone. So close...
        `);
        this.allow(this._restart, 'Restart');
    }

    _hide() {
        this.title('Ending #8');
        this.text(`
            You look around and find a pillar. You scurry to hide behind the pillar while you try to figure out what
            to do.
            <br/>
            "Grab the Stone, you moron!" Voldemort hisses. "It was right next to you..."
            <br/><br/>
            You hesitate but it is too late. Dumbledore barges in through the flame door. Potter points at your hiding
            spot. You try to run, but Voldemort is faster. He leaves your body fleeing while you drop to the ground,
            dead. What happens later is history.
        `);
        this.allow(this._restart, 'Restart');
    }

    _imperio() {
        this.title('Ending #9');
        this.text(`
            "<i>Imperio!</i>" you direct your wand to Potter. He falls under your influence.
            <br/>
            "Hand me the Stone." you command Potter. He complies.
            <br/>
            "Now, when Dumbledore comes, you will defend me with your life." you direct him again. Potter nods his head.
            <br/><br/>
            When Dumbledore arrives, he is greeted by a Potter under your control. In fear of harming Potter, Dumbledore
            tries to circumvent him in vain. When Dumbledore has broken your spell on Potter, it is too late.
            <br/><br/>
            You have "revived" your master, Lord Voldemort while Dumbledore is distracted. Voldemort exits your body
            and regains a solid form, and you survive thanks to the power of the Sorcerer's Stone.
            <br/><br/>
            As Dumbledore is distracted, he is seriously injured by the combined forces of the Dark Lord and you.
            Potter is killed in the fight, and you and Voldemort escape before reinforcements arrive.
            <br/><br/>
            Years later, Voldemort defeats Dumbledore and conquers the entire world. Pleased with your quick-thinking,
            he leaves you a small role in his newly established government.
        `);
        this.allow(this._restart, 'Restart');
    }
    /*
    Quidditch: fast.
    1) choose to cast spell or not. Will cast regardless. If did not read book will fail to cast spell. The Dark
    Lord will get angry and completely overpower you (if defied or attempted suicide). If do cast spells will get knocked
    over by Hermione regardless if you move out of the way.
    2) if defied and attempted suicide and read spell, you can choose to cast on self and you will fall down the stands
    and die. Voldemort is uncovered and a rapid response from the ministry of magic is dispatched. (meh ending)

    Last chapter
    Standing in front of Mirror. Harry barges in. If you have touched him before, you will have choice to put on gloves
   . If you strangle Harry now, he will give you the stone and pass out. Now you have chance to hide or flee.
    1) if hide, Dumbledore will come while Voldemort is revived. An epic battle ensues but eventually Voldemort
    is defeated like in the books. And oh by the way you die in the battle
    2) if confront Dumbledore you will distract him while Voldemort is revived. You will be struck down, but
    Voldemort kills both of Harry and serious injures Dumbledore (as Dumbledore is distracted by you). Later, Voldemort
    defeats most of magic world and you become his right-hand man.
    3) if flee, you will get caught by Dumbledore and get struck down by him. You will be imprisoned and Voldemort will
    flee
    If you have not touched Harry before, strangling him will lead to the book ending. You also have the options of
    1) defy Voldemort. you will die here
    2) crucio Harry. He feels no pain as you do not have enough spite
    3) break the mirror. If you have read 'Buffer overflow' before, the program will crash and everything burns
        if not, nothing happens and you get caught by dumbledore and go to prison
    4) flee. You will fail and get imprisoned.
     */
}