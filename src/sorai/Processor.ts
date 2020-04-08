import CommandList from "../constants/CommandList";
import CommandPoster from "./CommandPoster";
import IframeLoader from "./IframeLoader";
import HooksList from "../constants/HooksList";
import ClientHook from "./ClientHook";
import {ErrorMessages} from "../constants/ClientMessagesInterface";

interface CommandObject {
  [key: string]: {command: CommandList, payload?: any}
}

class Processor {
  private commandPoster: CommandPoster;
  private iframeLoader: IframeLoader;

  set setCommandPoster(commandPoster: CommandPoster) {
    this.commandPoster = commandPoster;
  }

  set setIframeLoader(iframeLoader: IframeLoader) {
    this.iframeLoader = iframeLoader;
  }

  transformCommandObj(queue: IArguments[]) {
    let commands: any = {};
    for(let i = 0; i < queue.length; i++) {
      if (queue[i][0] === CommandList.Send) {
        if (commands[queue[i][0]]) {
          commands[queue[i][0]].payload.push(queue[i][1]);
        } else {
          commands[queue[i][0]] = {
            command: queue[i][0],
            payload: [],
          };
          commands[queue[i][0]].payload.push(queue[i][1]);
        }
        continue;
      }
      commands[queue[i][0]] = {
        command: queue[i][0],
        payload: queue[i][1],
      }
    }
    return commands;
  }
  
  processQueue(commandsObj: CommandObject) {
    console.log("messages to be processed, ", commandsObj);
    if (!commandsObj || !commandsObj[CommandList.Init]) return;

    if (commandsObj![CommandList.Init]) {
      if (commandsObj![CommandList.Tenant]) {
        const {command, payload} = commandsObj![CommandList.Tenant];
        commandsObj![CommandList.Init].payload[command] = payload;
      }
      this.commandPoster.start(
        commandsObj![CommandList.Init].command,
        commandsObj![CommandList.Init].payload
      );
    } else {
      return;
    }

    if (commandsObj![CommandList.Style]) {
      this.commandPoster.style(
        commandsObj![CommandList.Style].command,
        commandsObj![CommandList.Style].payload,
      )
    }

    if (commandsObj![CommandList.Tnc]) {
      this.commandPoster.tnc(
        commandsObj![CommandList.Tnc].command,
        commandsObj![CommandList.Tnc].payload,
      )
    }

    if (commandsObj![CommandList.Gtm]) {
      this.commandPoster.gtm(
        commandsObj![CommandList.Gtm].command,
        commandsObj![CommandList.Gtm].payload,
      )
    }

    if (commandsObj![CommandList.Upload]) {
      this.commandPoster.upload(
        commandsObj![CommandList.Upload].command,
        commandsObj![CommandList.Upload].payload,
      )
    }

    if (commandsObj![HooksList.OnMessage]) {
      ClientHook.attachHook(
        commandsObj![HooksList.OnMessage].command,
        commandsObj![HooksList.OnMessage].payload,
      )
    }

    if (commandsObj![HooksList.OnGtmEvent]) {
      const { command, payload } = commandsObj![HooksList.OnGtmEvent];
      ClientHook.attachHook(command, payload);
    }

    if (commandsObj![HooksList.BeforeSend]) {
      ClientHook.attachHook(
        commandsObj![HooksList.BeforeSend].command,
        commandsObj![HooksList.BeforeSend].payload,
      )
    }

    if (commandsObj![HooksList.AfterSend]) {
      ClientHook.attachHook(
        commandsObj![HooksList.AfterSend].command,
        commandsObj![HooksList.AfterSend].payload,
      )
    }

    if (commandsObj![CommandList.Send]) {
      for (let i = 0; i < commandsObj![CommandList.Send].payload.length; i++) {
        this.commandPoster.send(
          commandsObj![CommandList.Send].command,
          commandsObj![CommandList.Send].payload[i],
        );
      }
    }

    if (commandsObj![CommandList.Attach]) {
      this.iframeLoader.attachSoraFrame(commandsObj![CommandList.Attach].payload);
    }

  }

  soraiRouterFunc(command: string, payload: any) {
    if (this.isInitCommand(command)) return this.commandPoster.start(command, payload);
    if (command === CommandList.Style) return this.commandPoster.style(command, payload);
    if (command === CommandList.Send) return this.commandPoster.send(command, payload);
    if (command === CommandList.Tnc) return this.commandPoster.tnc(command, payload);
    if (command === CommandList.Gtm) return this.commandPoster.gtm(command, payload);
    if (command === HooksList.OnMessage) return ClientHook.attachHook(command, payload);
    if (command === HooksList.BeforeSend) return ClientHook.attachHook(command, payload);
    if (command === HooksList.AfterSend) return ClientHook.attachHook(command, payload);
    if (command === CommandList.Attach) return this.iframeLoader.attachSoraFrame(payload);
    if (command === CommandList.Detach) return this.iframeLoader.detachSoraFrame();

    // Devpanel only
    if (command === CommandList.SimulateBackend) return this.commandPoster.simulateBackend(command, payload);

    // If it get here, then the command is not supported
    console.error(ErrorMessages.UNSUPPORTED_COMMAND(command));
  }

  isInitCommand = (command: string) =>
    command === CommandList.Init;

}

export default Processor;