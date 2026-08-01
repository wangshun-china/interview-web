import unittest

from agent import Agent, BEGIN, END, replace_managed_block, unmanaged_remote_ports


class AgentConfigTest(unittest.TestCase):
    def test_appends_and_replaces_only_managed_block(self):
        original = 'serverAddr = "example.com"\n\n[[proxies]]\nname = "manual"\nremotePort = 3000\n'
        first = replace_managed_block(original, [{"name": "demo", "protocol": "tcp", "localPort": 10001, "remotePort": 20001}])
        self.assertIn('name = "manual"', first)
        self.assertIn('name = "ops-demo"', first)
        self.assertEqual(first.count(BEGIN), 1)
        second = replace_managed_block(first, [{"name": "next", "protocol": "udp", "localPort": 10002, "remotePort": 20002}])
        self.assertNotIn('name = "ops-demo"', second)
        self.assertIn('name = "ops-next"', second)
        self.assertEqual(second.count(END), 1)

    def test_unmanaged_ports_excludes_managed_block(self):
        config = 'remotePort = 3000\n' + replace_managed_block('', [{"name": "demo", "localPort": 10001, "remotePort": 20001}])
        self.assertEqual(unmanaged_remote_ports(config), {3000})

    def test_docker_action_is_fixed_and_checks_container_identity(self):
        agent = Agent.__new__(Agent)
        agent.apply = True
        calls = []

        def command(*args):
            calls.append(args)
            if args[:3] == ("docker", "inspect", "--format"):
                return True, "running\t\t/demo-api"
            return True, "demo-api"

        agent.command = command
        container_id = "a" * 64
        result = agent.docker_action({"containerId": container_id, "containerName": "demo-api", "action": "restart"})
        self.assertIn("demo-api", result)
        self.assertEqual(calls[-1], ("docker", "restart", "--time", "10", container_id))
        with self.assertRaises(ValueError):
            agent.docker_action({"containerId": container_id, "containerName": "demo-api", "action": "exec"})


if __name__ == "__main__":
    unittest.main()
